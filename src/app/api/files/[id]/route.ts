import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { recordAuditLog } from '@/lib/audit';

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

        // Ownership updates (legacy support)
        ownerName: body.ownerName,
        beneficiaryName: body.beneficiaryName,
        paymentsDoneBy: body.paymentsDoneBy,

        // Verification updates
        customerStatus: body.customerStatus || undefined,
        customerCallMethod: body.customerCallMethod || null,
        customerComment: body.customerComment,

        guarantorStatus: body.guarantorStatus || undefined,
        guarantorCallMethod: body.guarantorCallMethod || null,
        guarantorComment: body.guarantorComment,

        thirdPartyStatus: body.thirdPartyStatus || undefined,
        thirdPartyComment: body.thirdPartyComment,

        needsManagerApproval: body.needsManagerApproval === true || body.needsManagerApproval === "true" || false,
      }
    });

    // Create audit log entry for significant updates
    const userId = request.headers.get('x-user-id') || 'SYSTEM';

    let auditAction = 'FILE_KYC_UPDATE';
    let auditDetails = `Updated KYC data for file ${id} (${body.title || 'unnamed'})`;

    if (body.customerStatus || body.guarantorStatus || body.thirdPartyStatus) {
      auditAction = 'VERIFICATION_UPDATE';
      auditDetails = `File ${id} status update: Customer[${body.customerStatus || 'N/A'}], Guarantor[${body.guarantorStatus || 'N/A'}], ThirdParty[${body.thirdPartyStatus || 'N/A'}]`;
    }

    await recordAuditLog(userId, auditAction, auditDetails);


    return NextResponse.json(updatedFile);
  } catch (error) {
    console.error('File Update Error:', error);
    return NextResponse.json({ error: 'Failed to update file' }, { status: 500 });
  }
}
