import PDFDocument from "pdfkit";

/**
 * License PDF generator.
 *
 * Renders a one-page non-exclusive license that accompanies every paid
 * checkout. Layout is intentionally minimal — Times-Roman body, generous
 * margins, clear section labels — so it reads like a producer contract
 * rather than a receipt.
 *
 * pdfkit is used because:
 *  - It ships its own AFM fonts (Times-Roman, Helvetica) so the layout
 *    works in serverless without bundling external font files.
 *  - It streams to a Buffer cleanly via the `on("data")` / `on("end")`
 *    pattern, which we collect and hand back to the email sender.
 */

const TIER_TERMS = {
  mp3: {
    label: "MP3 Lease",
    delivery: "Untagged MP3 (320kbps)",
    terms: [
      "Use for one (1) commercial recording.",
      "Distribute up to ten thousand (10,000) audio streams across all platforms.",
      "Non-exclusive — the underlying instrumental remains available for license to other artists.",
      "Producer credit required: “prod. Xavier Moreno” in song title or first line of credits.",
      "No master use in film, television, or advertising without separate written agreement.",
    ],
  },
  wav: {
    label: "WAV Lease",
    delivery: "Untagged WAV + MP3 (320kbps)",
    terms: [
      "Use for one (1) commercial recording.",
      "Distribute up to fifty thousand (50,000) audio streams across all platforms.",
      "YouTube monetization permitted on the licensed recording.",
      "Non-exclusive — the underlying instrumental remains available for license to other artists.",
      "Producer credit required: “prod. Xavier Moreno” in song title or first line of credits.",
      "No master use in film, television, or advertising without separate written agreement.",
    ],
  },
};

function formatDate(date) {
  // Long-form, locale-stable date so the PDF reads the same everywhere.
  const d = date instanceof Date ? date : new Date(date || Date.now());
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/**
 * @param {Object} args
 * @param {string} args.buyerName    - Buyer's full name (from Stripe customer_details).
 * @param {string} args.buyerEmail   - Buyer's email (from Stripe customer_details).
 * @param {string} args.beatTitle    - Beat title (e.g. "Tarde de Lluvia").
 * @param {string} args.tier         - Tier id: "mp3" or "wav".
 * @param {string} args.orderId      - Stripe Checkout Session id, surfaced as Order ID.
 * @param {Date|string} [args.date]  - Execution date; defaults to now.
 * @returns {Promise<Buffer>} The rendered PDF.
 */
export function generateLicensePDF({
  buyerName,
  buyerEmail,
  beatTitle,
  tier,
  orderId,
  date,
}) {
  return new Promise((resolve, reject) => {
    try {
      const tierKey = String(tier || "").toLowerCase();
      const tierSpec = TIER_TERMS[tierKey] || TIER_TERMS.mp3;
      const tierLabel = tierSpec.label;
      const tierUpper = tierKey.toUpperCase();
      const buyer = buyerName?.trim() || "the Licensee";
      const buyerEmailLine = buyerEmail?.trim() || "—";
      const executionDate = formatDate(date);

      const doc = new PDFDocument({
        size: "LETTER",
        margins: { top: 72, bottom: 72, left: 72, right: 72 },
        info: {
          Title: `${beatTitle} — ${tierLabel}`,
          Author: "Xavier Moreno",
          Subject: "Non-Exclusive License Agreement",
        },
      });

      const chunks = [];
      doc.on("data", (c) => chunks.push(c));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // ---- Header -------------------------------------------------------
      doc
        .font("Times-Roman")
        .fontSize(18)
        .text("Xavier Moreno", { align: "left" });
      doc
        .font("Times-Italic")
        .fontSize(12)
        .fillColor("#555555")
        .text("Non-Exclusive License Agreement", { align: "left" });
      doc.moveDown(0.6);

      // Horizontal rule.
      doc
        .strokeColor("#000000")
        .lineWidth(0.75)
        .moveTo(doc.page.margins.left, doc.y)
        .lineTo(doc.page.width - doc.page.margins.right, doc.y)
        .stroke();
      doc.moveDown(0.9);

      // ---- Meta block ---------------------------------------------------
      doc.fillColor("#000000").font("Times-Roman").fontSize(10.5);
      doc.text(`Date:      ${executionDate}`);
      doc.text(`Order ID:  ${orderId || "—"}`);
      doc.moveDown(0.9);

      // ---- Parties ------------------------------------------------------
      doc.font("Times-Bold").fontSize(11).text("Parties");
      doc.moveDown(0.25);
      doc
        .font("Times-Roman")
        .fontSize(11)
        .text(
          `This Non-Exclusive License Agreement (the “Agreement”) is entered into on ${executionDate} between Xavier Moreno (“Licensor”, “Producer”) and ${buyer} (“Licensee”), reachable at ${buyerEmailLine}.`,
          { align: "left", lineGap: 2 },
        );
      doc.moveDown(0.8);

      // ---- Production ---------------------------------------------------
      doc.font("Times-Bold").fontSize(11).text("Production");
      doc.moveDown(0.25);
      doc
        .font("Times-Roman")
        .fontSize(11)
        .text(`Title:    ${beatTitle}`)
        .text(`Tier:     ${tierUpper} Lease`)
        .text(`Delivery: ${tierSpec.delivery}`);
      doc.moveDown(0.8);

      // ---- Grant of rights ----------------------------------------------
      doc.font("Times-Bold").fontSize(11).text("Grant of Rights");
      doc.moveDown(0.25);
      doc
        .font("Times-Roman")
        .fontSize(11)
        .text(
          "In consideration of the license fee already received, Licensor grants Licensee the following non-exclusive rights:",
          { lineGap: 2 },
        );
      doc.moveDown(0.4);

      tierSpec.terms.forEach((line) => {
        const startX = doc.page.margins.left;
        const bulletX = startX + 6;
        const textX = startX + 18;
        const y = doc.y;
        doc.font("Times-Roman").fontSize(11);
        doc.text("•", bulletX, y, { lineBreak: false });
        doc.text(line, textX, y, {
          width:
            doc.page.width - doc.page.margins.right - textX,
          lineGap: 2,
        });
        doc.moveDown(0.25);
      });
      doc.moveDown(0.6);

      // ---- Credit -------------------------------------------------------
      doc.font("Times-Bold").fontSize(11).text("Producer Credit");
      doc.moveDown(0.25);
      doc
        .font("Times-Roman")
        .fontSize(11)
        .text(
          "Producer credit must appear in the song title or first line of the credits as: “prod. Xavier Moreno”. Failure to provide credit constitutes a material breach of this Agreement.",
          { lineGap: 2 },
        );
      doc.moveDown(0.6);

      // ---- Reserved rights ---------------------------------------------
      doc.font("Times-Bold").fontSize(11).text("Reserved Rights");
      doc.moveDown(0.25);
      doc
        .font("Times-Roman")
        .fontSize(11)
        .text(
          "Licensor retains all copyright in the underlying instrumental composition and master recording. Any use beyond the rights granted above — including additional recordings, sync licensing, or stream counts exceeding the cap — requires a separate written agreement.",
          { lineGap: 2 },
        );
      doc.moveDown(1.2);

      // ---- Signature ----------------------------------------------------
      const sigY = doc.y;
      doc
        .strokeColor("#000000")
        .lineWidth(0.5)
        .moveTo(doc.page.margins.left, sigY + 28)
        .lineTo(doc.page.margins.left + 220, sigY + 28)
        .stroke();
      doc
        .font("Times-Italic")
        .fontSize(11)
        .text("Xavier Moreno", doc.page.margins.left, sigY + 6);
      doc
        .font("Times-Roman")
        .fontSize(9.5)
        .fillColor("#555555")
        .text("Xavier Moreno — Producer", doc.page.margins.left, sigY + 32);
      doc
        .fillColor("#555555")
        .fontSize(9.5)
        .text(executionDate, doc.page.margins.left, sigY + 46);

      // ---- Footer -------------------------------------------------------
      doc
        .font("Times-Italic")
        .fontSize(8.5)
        .fillColor("#888888")
        .text(
          "Xavier Moreno — producer, songwriter. xavier-moreno-store.vercel.app",
          doc.page.margins.left,
          doc.page.height - doc.page.margins.bottom + 24,
          {
            width:
              doc.page.width -
              doc.page.margins.left -
              doc.page.margins.right,
            align: "center",
          },
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
