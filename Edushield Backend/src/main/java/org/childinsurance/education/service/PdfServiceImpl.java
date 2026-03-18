package org.childinsurance.education.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.draw.LineSeparator;
import lombok.extern.slf4j.Slf4j;
import org.childinsurance.education.entity.PolicyApplication;
import org.childinsurance.education.entity.PolicySubscription;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
@Slf4j
public class PdfServiceImpl implements PdfService {

    private static final Font TITLE_FONT = FontFactory.getFont(FontFactory.HELVETICA, 22, Font.BOLD, Color.BLACK);
    private static final Font SUBTITLE_FONT = FontFactory.getFont(FontFactory.HELVETICA, 14, Font.BOLD, Color.DARK_GRAY);
    private static final Font NORMAL_FONT = FontFactory.getFont(FontFactory.HELVETICA, 12, Font.NORMAL, Color.BLACK);
    private static final Font BOLD_FONT = FontFactory.getFont(FontFactory.HELVETICA, 12, Font.BOLD, Color.BLACK);

    @Override
    public byte[] generatePolicyCertificate(PolicyApplication application, PolicySubscription subscription) {
        log.info("Generating PDF certificate for application ID: {}", application.getApplicationId());
        
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 50, 50, 50, 50);
            PdfWriter.getInstance(document, out);
            document.open();

            // 1. Header / Logo Text
            Paragraph header = new Paragraph("EduShield Insurance", TITLE_FONT);
            header.setAlignment(Element.ALIGN_CENTER);
            document.add(header);
            
            Paragraph subHeader = new Paragraph("Child Education Policy Certificate", SUBTITLE_FONT);
            subHeader.setAlignment(Element.ALIGN_CENTER);
            subHeader.setSpacingAfter(20);
            document.add(subHeader);

            // Separator Line
            LineSeparator line = new LineSeparator();
            line.setLineColor(Color.LIGHT_GRAY);
            document.add(new Chunk(line));
            document.add(new Paragraph(" "));

            // 2. Congratulations Message
            Paragraph congrats = new Paragraph(
                    "This document certifies that the education insurance policy detailed below has been formally approved and bound. " +
                    "Thank you for trusting us to secure your child's educational future.", NORMAL_FONT);
            congrats.setSpacingAfter(20);
            document.add(congrats);

            // 3. Details Table
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10);
            table.setSpacingAfter(20);
            table.setWidths(new float[]{1.5f, 2.5f});

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");

            // Adding rows
            addTableRow(table, "Policyholder Name", application.getUser().getName());
            addTableRow(table, "Child Name", application.getChild().getChildName());
            addTableRow(table, "Policy Name", application.getPolicy().getPolicyName());
            addTableRow(table, "Application ID", "APP-" + application.getApplicationId());
            addTableRow(table, "Subscription No.", subscription.getSubscriptionNumber());
            addTableRow(table, "Status", "APPROVED & ACTIVE");
            addTableRow(table, "Start Date", subscription.getStartDate().format(formatter));
            addTableRow(table, "Maturity Date", subscription.getMaturityDate().format(formatter));
            addTableRow(table, "Coverage Amount", "$" + subscription.getCoverageAmount());
            addTableRow(table, "Calculated Premium", "$" + subscription.getPremiumAmount() + " / " + application.getPaymentFrequency());

            document.add(table);

            // 4. Footer
            document.add(new Chunk(line));
            Paragraph footer = new Paragraph("For any questions or claims, please contact support@edushield.com.\n" +
                    "Generated automatically by EduShield Systems.", FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10, Color.GRAY));
            footer.setAlignment(Element.ALIGN_CENTER);
            footer.setSpacingBefore(30);
            document.add(footer);

            document.close();
            log.info("PDF generated successfully. Size: {} bytes", out.size());
            return out.toByteArray();
            
        } catch (Exception ex) {
            log.error("Failed to generate PDF certificate: {}", ex.getMessage(), ex);
            throw new RuntimeException("Error generating PDF certificate");
        }
    }

    private void addTableRow(PdfPTable table, String label, String value) {
        PdfPCell cell1 = new PdfPCell(new Phrase(label, BOLD_FONT));
        cell1.setBorderWidth(0);
        cell1.setPadding(8);
        cell1.setBackgroundColor(new Color(245, 245, 245));

        PdfPCell cell2 = new PdfPCell(new Phrase(value != null ? value : "N/A", NORMAL_FONT));
        cell2.setBorderWidth(0);
        cell2.setPadding(8);

        table.addCell(cell1);
        table.addCell(cell2);
    }
}
