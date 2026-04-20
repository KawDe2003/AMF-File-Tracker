import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const file = await prisma.file.findUnique({
      where: { id },
      include: {
        currentDept: true,
        currentUser: true,
        movements: {
          include: {
            fromDept: true,
            toDept: true,
            sender: true,
            receiver: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return NextResponse.json(file);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch file details' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;

    const updatedFile = await prisma.file.update({
      where: { id },
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
        fileType: body.fileType,
        nic: body.nic,
        priority: body.priority,
        status: body.status,

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
        cooperationRating: body.cooperationRating ? parseInt(body.cooperationRating) : undefined,
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
        guarantorCooperationRating: body.guarantorCooperationRating !== undefined ? parseInt(body.guarantorCooperationRating) : undefined,
        guarantorContactType: body.guarantorContactType,
        guarantorSpecialRemarks: body.guarantorSpecialRemarks,

        // Ownership updates (legacy support)
        ownerName: body.ownerName,
        beneficiaryName: body.beneficiaryName,
        paymentsDoneBy: body.paymentsDoneBy,
        
        // Verification updates
        customerStatus: body.customerStatus,
        customerCallMethod: body.customerCallMethod,
        customerComment: body.customerComment,
        
        guarantorStatus: body.guarantorStatus,
        guarantorCallMethod: body.guarantorCallMethod,
        guarantorComment: body.guarantorComment,
        
        thirdPartyStatus: body.thirdPartyStatus,
        thirdPartyComment: body.thirdPartyComment,
        
        needsManagerApproval: body.needsManagerApproval,
      }
    });

    // Create audit log entry for significant status changes
    if (body.customerStatus || body.guarantorStatus || body.thirdPartyStatus) {
      await prisma.auditLog.create({
        data: {
          userId: body.updaterId || 'SYSTEM', // Should ideally be session user
          action: 'VERIFICATION_UPDATE',
          details: `Updated verification status for file ${id}. Customer: ${body.customerStatus || 'No change'}, Third-Party: ${body.thirdPartyStatus || 'No change'}`,
        }
      });
    }

    return NextResponse.json(updatedFile);
  } catch (error) {
    console.error('File Update Error:', error);
    return NextResponse.json({ error: 'Failed to update file' }, { status: 500 });
  }
}
