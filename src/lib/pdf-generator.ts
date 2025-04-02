import { jsPDF } from "jspdf";
import { Protocol } from "@/types";
import { format } from "date-fns";

export const generatePDF = async (protocol: Protocol) => {
  try {
    const customer = protocol.customer;

    if (!customer) {
      throw new Error("Cliente não encontrado");
    }

    // Create PDF document with custom font support
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Helper function for text wrapping
    const wrapText = (text: string, maxWidth: number): string[] => {
      const words = text.split(" ");
      const lines: string[] = [];
      let currentLine = "";

      words.forEach((word) => {
        const testLine = currentLine + (currentLine ? " " : "") + word;
        const testWidth =
          (doc.getStringUnitWidth(testLine) * doc.getFontSize()) /
          doc.internal.scaleFactor;

        if (testWidth > maxWidth) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });

      if (currentLine) {
        lines.push(currentLine);
      }

      return lines;
    };

    // Set up document
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("TrainerScribe Protocol", 20, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${format(new Date(), "MMMM d, yyyy")}`, 20, 30);

    // Client information
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Client Information", 20, 45);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${customer.first_name} ${customer.last_name}`, 20, 55);
    doc.text(`Contact: ${customer.email} | ${customer.phone}`, 20, 65);
    doc.text(
      `Address: ${customer.address}, ${customer.city}, ${customer.uf}, ${customer.country}`,
      20,
      70
    );

    // Protocol duration
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Protocol Duration", 20, 85);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Start Date: ${format(new Date(protocol.startDate), "MMMM d, yyyy")}`,
      20,
      95
    );
    doc.text(
      `End Date: ${format(new Date(protocol.endDate), "MMMM d, yyyy")}`,
      20,
      100
    );
    doc.text(`Duration: ${protocol.durationDays} days`, 20, 105);

    // Diet plan
    let yPosition = 120;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Diet Plan", 20, yPosition);
    yPosition += 10;

    protocol.diet.meals.forEach((meal) => {
      // Check if we need a new page
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text(`${meal.name}`, 20, yPosition);
      yPosition += 5;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");

      const descriptionLines = wrapText(meal.description, 170);
      descriptionLines.forEach((line) => {
        doc.text(line, 20, yPosition);
        yPosition += 5;
      });

      yPosition += 5;
    });

    // Workout plan
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    } else {
      yPosition += 10;
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Workout Plan", 20, yPosition);
    yPosition += 10;

    protocol.workouts.forEach((workout) => {
      // Check if we need a new page
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text(`${workout.name}`, 20, yPosition);
      yPosition += 8;

      workout.exercises.forEach((exercise, exerciseIndex) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(
          `${exerciseIndex + 1}. ${exercise.name}: ${exercise.sets} sets x ${
            exercise.reps
          } reps`,
          25,
          yPosition
        );
        if (exercise.notes) {
          yPosition += 5;
          doc.text(`   Notes: ${exercise.notes}`, 25, yPosition);
        }
        yPosition += 7;
      });

      yPosition += 5;
    });

    // Supplementation
    if (protocol.supplementation.length > 0) {
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
      } else {
        yPosition += 10;
      }

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Supplementation", 20, yPosition);
      yPosition += 10;

      protocol.supplementation.forEach((supplement, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}. ${supplement.name}`, 20, yPosition);
        yPosition += 5;

        doc.setFont("helvetica", "normal");
        doc.text(`Dosage: ${supplement.dosage}`, 25, yPosition);
        yPosition += 5;

        doc.text(`Frequency: ${supplement.frequency}`, 25, yPosition);
        yPosition += 5;

        if (supplement.notes) {
          doc.text(`Notes: ${supplement.notes}`, 25, yPosition);
          yPosition += 5;
        }

        yPosition += 3;
      });
    }

    // Footer with signature
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `TrainerScribe - Professional Protocol - Page ${i} of ${pageCount}`,
        20,
        290
      );
    }

    // Save the PDF
    const fileName = `${customer.first_name}_${
      customer.last_name
    }_Protocol_${format(new Date(), "yyyy-MM-dd")}.pdf`;
    doc.save(fileName);

    return fileName;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
