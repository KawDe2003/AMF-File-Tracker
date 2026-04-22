import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import ExcelJS from "exceljs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "verification";
    const dateParam = searchParams.get("date");
    
    const filterDate = dateParam ? new Date(dateParam) : null;
    if (filterDate) {
      filterDate.setHours(23, 59, 59, 999); // End of day for "As At" snapshot
    }

    const files = await prisma.file.findMany({
      where: filterDate ? { 
        createdAt: { lte: filterDate } 
      } : {},
      include: {
        currentDept: true
      }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(type === "verification" ? "Verification Matrix" : "Full Inventory");

    // Title Row
    worksheet.mergeCells("A1:G1");
    const titleCell = worksheet.getCell("A1");
    const snapshotText = filterDate ? ` (As at ${filterDate.toISOString().split('T')[0]})` : "";
    titleCell.value = (type === "verification" ? "TRACER: CUSTOMER & GUARANTOR VERIFICATION MATRIX" : "TRACER: MASTER INVENTORY PROTOCOL") + snapshotText;
    titleCell.font = { size: 14, bold: true, color: { argb: "FFFFFFFF" } };
    titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E40AF" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    worksheet.getRow(1).height = 35;

    let headers: string[];
    let data: any[];

    if (type === "verification") {
      headers = [
        "File ID", "Customer Name", "NIC", "Vehicle No", "Contact No", "Status", "Comment"
      ];
      data = files.map(f => [
        f.id.substring(0, 8).toUpperCase(),
        f.title,
        f.nic,
        f.vehicleNo || "N/A",
        f.contactNo || "N/A",
        f.customerStatus,
        f.customerComment || ""
      ]);
    } else {
      headers = [
        "File ID", "Customer Name", "NIC", "Finance Co", "Vehicle No", "Status", "Date"
      ];
      data = files.map(f => [
        f.id.substring(0, 8).toUpperCase(),
        f.title,
        f.nic,
        f.financeCompany || "AMF",
        f.vehicleNo || "N/A",
        f.status,
        f.fileReceivedDate || "N/A"
      ]);
    }

    // Add Header Row
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF334155" } };
      cell.alignment = { horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
    });

    // Add Data Rows
    data.forEach((rowData, index) => {
      const row = worksheet.addRow(rowData);
      
      // Zebra Striping
      if (index % 2 === 1) {
        row.eachCell((cell) => {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF1F5F9" } };
        });
      }

      // Status Coloring
      const statusCell = row.getCell(headers.indexOf("Status") + 1);
      if (statusCell.value === "VERIFIED" || statusCell.value === "AT_BRANCH") {
        statusCell.font = { color: { argb: "FF059669" }, bold: true };
      }
    });

    // Auto Column Width
    worksheet.columns.forEach(column => {
      let maxColumnLength = 0;
      column.eachCell!({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxColumnLength) {
          maxColumnLength = columnLength;
        }
      });
      column.width = maxColumnLength < 12 ? 12 : maxColumnLength + 2;
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = type === "verification" ? `Verification_Report_${timestamp}` : `Inventory_Report_${timestamp}`;

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=${filename}.xlsx`
      }
    });

  } catch (error) {
    console.error("Export Error:", error);
    return NextResponse.json({ error: "Failed to generate Excel report" }, { status: 500 });
  }
}
