import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q');
    
    // Get requester info from headers (set by middleware)
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');
    const isCallingAgent = request.headers.get('x-user-calling-agent') === 'true';

    // Role-based where clause: Calling agents only see files assigned to them
    const baseWhere: any = isCallingAgent ? { currentUserId: userId } : {};
    
    let files;
    if (search) {
      files = await prisma.file.findMany({
        where: {
          ...baseWhere,
          OR: [
            { nic: { contains: search } },
            { vehicleNo: { contains: search } },
            { tagNo: { contains: search } },
            { blNo: { contains: search } },
            { engineNo: { contains: search } },
            { chassisNo: { contains: search } },
            { leasingCRNo: { contains: search } },
            { id: { contains: search } },
          ]
        },
        select: {
          id: true,
          title: true,
          nic: true,
          fileType: true,
          status: true,
          createdAt: true,
          currentDept: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
    } else {
      // For list view, handle explicit agent filtering for Admins
      const filterAgentId = searchParams.get('agentId');
      const finalWhere = { ...baseWhere };
      
      const isAdminOrManager = userRole === 'ADMIN' || userRole === 'MANAGER';
      
      if (isAdminOrManager && filterAgentId) {
        finalWhere.currentUserId = filterAgentId;
      }

      files = await prisma.file.findMany({
        where: finalWhere,
        select: {
          id: true,
          title: true,
          nic: true,
          fileType: true,
          status: true,
          createdAt: true,
          currentDept: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    return NextResponse.json(files);
  } catch (error) {
    console.error('Fetch Files Error:', error);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Incoming Registration Payload:', body);
    
    // Core Field Validation
    if (!body.title || !body.nic) {
      console.warn('Missing core fields:', { title: body.title, nic: body.nic });
      return NextResponse.json({ error: 'Customer Name and NIC are mandatory' }, { status: 400 });
    }

    // Get the first department as default if none provided
    let deptId = body.currentDeptId;
    if (!deptId) {
      const firstDept = await prisma.department.findFirst();
      deptId = firstDept?.id;
    }

    const file = await prisma.file.create({
      data: {
        // Core Identifiers
        financeCompany: body.financeCompany,
        title: body.title,
        tagNo: body.tagNo,
        blNo: body.blNo,
        leasingCRNo: body.leasingCRNo,
        vehicleNo: body.vehicleNo,
        engineNo: body.engineNo,
        chassisNo: body.chassisNo,
        regUnreg: body.regUnreg,
        fileReceivedDate: body.fileReceivedDate,
        
        // Tracking
        fileType: body.fileType || 'LEASING',
        nic: body.nic,
        priority: body.priority || 'LOW',
        status: 'AT_BRANCH',
        currentDeptId: deptId,

        // Branch & Officer
        branchCode: body.branchCode,
        marketingOfficer: body.marketingOfficer,

        // Residential
        address: body.address,
        residenceType: body.residenceType,

        // Contact
        contactNo: body.contactNo,
        whatsappNo: body.whatsappNo,
        altContactNo: body.altContactNo,
        bestTimeToCall: body.bestTimeToCall,

        // Employment
        employmentType: body.employmentType,
        employerName: body.employerName,
        jobTitle: body.jobTitle,
        economicSector: body.economicSector,
        salaryDate: body.salaryDate,
        workExperience: body.workExperience,
        monthlyIncome: body.monthlyIncome,
        otherIncome: body.otherIncome,

        // Spouse/Relative
        spouseName: body.spouseName,
        spouseContact: body.spouseContact,
        spouseRelationship: body.spouseRelationship,

        // Asset & Financial
        bikeMakeModel: body.bikeMakeModel,
        loanAmount: body.loanAmount,
        assetUser: body.assetUser,
        daysReceivedVehicle: body.daysReceivedVehicle,
        vehiclePrice: body.vehiclePrice,
        downPayment: body.downPayment,
        documentCharges: body.documentCharges,
        insuranceCompany: body.insuranceCompany,

        // Outcome (Customer)
        guarantorRelationship: body.guarantorRelationship,
        detailsProvided: body.detailsProvided,
        cooperationRating: (body.cooperationRating && !isNaN(parseInt(body.cooperationRating))) ? parseInt(body.cooperationRating) : null,
        contactType: body.contactType,
        specialRemarks: body.specialRemarks,

        // NEW: Detailed Guarantor KYC Data
        guarantorNic: body.guarantorNic,
        guarantorAddress: body.guarantorAddress,
        guarantorResidenceType: body.guarantorResidenceType,
        guarantorContactNo: body.guarantorContactNo,
        guarantorWhatsappNo: body.guarantorWhatsappNo,
        guarantorAltContactNo: body.guarantorAltContactNo,
        guarantorBestTimeToCall: body.guarantorBestTimeToCall,
        guarantorEmploymentType: body.guarantorEmploymentType,
        guarantorEmployerName: body.guarantorEmployerName,
        guarantorJobTitle: body.guarantorJobTitle,
        guarantorEconomicSector: body.guarantorEconomicSector,
        guarantorSalaryDate: body.guarantorSalaryDate,
        guarantorWorkExperience: body.guarantorWorkExperience,
        guarantorMonthlyIncome: body.guarantorMonthlyIncome,
        guarantorOtherIncome: body.guarantorOtherIncome,
        guarantorCooperationRating: (body.guarantorCooperationRating && !isNaN(parseInt(body.guarantorCooperationRating))) ? parseInt(body.guarantorCooperationRating) : null,
        guarantorContactType: body.guarantorContactType,
        guarantorSpecialRemarks: body.guarantorSpecialRemarks,
      }
    });

    return NextResponse.json(file, { status: 201 });
  } catch (error) {
    console.error('Registration Error Detail:', error);
    return NextResponse.json({ 
      error: 'Failed to create file',
      details: error instanceof Error ? error.message : 'Unknown Database Error'
    }, { status: 500 });
  }
}
