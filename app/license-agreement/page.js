import Link from "next/link";
import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "License Agreement — Zae Moreno",
  description:
    "The license agreement that governs every production purchased from Zae Moreno.",
};

export default function LicenseAgreementPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="License Agreement"
      updated="May 15, 2026"
    >
      <p>
        This License Agreement (the &ldquo;Agreement&rdquo;) is entered into
        between Zae Moreno (&ldquo;Licensor&rdquo;) and the purchaser
        (&ldquo;Licensee&rdquo;). By purchasing a license through this site,
        Licensee agrees to be bound by this Agreement, the{" "}
        <Link href="/terms-of-service">Terms of Service</Link>, and the{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>

      <h2>1. Grant of License</h2>
      <p>
        Licensor grants Licensee a limited, non-transferable license to use the
        musical production identified at checkout (the &ldquo;Production&rdquo;),
        strictly under the tier purchased and the terms below.{" "}
        <strong>
          Licensee is purchasing usage rights only. No purchase under this
          Agreement transfers ownership of the Production.
        </strong>
      </p>

      <h2>2. Ownership Retained by Zae Moreno</h2>
      <p>
        Licensor retains 100% of all right, title, and interest in and to the
        Production, including without limitation:
      </p>
      <ul>
        <li>Copyright in the underlying composition and the master recording of the instrumental</li>
        <li>Authorship of the Production</li>
        <li>Publishing interest in the original Production</li>
        <li>Producer rights</li>
        <li>Stems, melodies, arrangements, and any element of the Production</li>
        <li>All other intellectual-property rights connected to the Production</li>
      </ul>
      <p>
        <strong>All rights not expressly granted to Licensee in this Agreement
        are reserved by Zae Moreno.</strong>
      </p>

      <h2>3. License Tiers</h2>

      <h3>MP3 Lease</h3>
      <ul>
        <li>Non-exclusive license</li>
        <li>MP3 file delivery (untagged, 320 kbps)</li>
        <li>Allowed for one (1) commercial recording</li>
        <li>Up to 10,000 streams across all platforms</li>
        <li>Producer credit required: &ldquo;Produced by Zae Moreno&rdquo;</li>
        <li>No ownership transfer</li>
      </ul>

      <h3>WAV Lease</h3>
      <ul>
        <li>Non-exclusive license</li>
        <li>High-quality WAV file delivery (with MP3)</li>
        <li>Allowed for one (1) commercial recording</li>
        <li>Higher stream limit than the MP3 lease (currently up to 50,000 streams across all platforms; the figure in effect at time of purchase will be stated on your receipt)</li>
        <li>Monetization on YouTube permitted</li>
        <li>Producer credit required: &ldquo;Produced by Zae Moreno&rdquo;</li>
        <li>No ownership transfer</li>
      </ul>

      <h3>Exclusive License</h3>
      <ul>
        <li>Exclusive usage rights for one (1) released recording</li>
        <li>Production removed from public sale after the exclusive license is completed</li>
        <li>No further non-exclusive licenses will be sold after the exclusive license is completed</li>
        <li>Previously sold non-exclusive licenses remain valid in accordance with their original terms</li>
        <li>Zae Moreno retains ownership, copyright, authorship, publishing interest in the original Production, producer rights, and intellectual property</li>
        <li>Producer credit required: &ldquo;Produced by Zae Moreno&rdquo;</li>
        <li>Final exclusive terms must be confirmed in writing before delivery</li>
      </ul>

      <h2>4. Prohibited Use</h2>
      <p>Licensee may not, under any circumstances:</p>
      <ul>
        <li>Resell, redistribute, lease, sublicense, upload, or give away the instrumental by itself</li>
        <li>Claim that Licensee created, produced, composed, or owns the original Production</li>
        <li>Register the beat or instrumental as Licensee&rsquo;s own copyright</li>
        <li>Use the instrumental for Content ID claims against Zae Moreno or other licensees</li>
        <li>Upload the instrumental to sample packs, stock music libraries, beat stores, NFTs, or AI training datasets without prior written permission</li>
      </ul>
      <p>
        Any use outside the scope of the license tier purchased is a material
        breach of this Agreement.
      </p>

      <h2>5. Producer Credit</h2>
      <p>
        All releases that use the Production must include the credit
        &ldquo;Produced by Zae Moreno&rdquo; in the song metadata and in any
        visible credit list (album notes, streaming-platform credits, video
        descriptions, and the like).
      </p>

      <h2>6. Term and Termination</h2>
      <ul>
        <li>Non-exclusive licenses are perpetual for the permitted use described above, subject to Licensee&rsquo;s ongoing compliance with this Agreement.</li>
        <li>Exclusive licenses are perpetual for the single released recording specified in the written exclusive agreement.</li>
        <li>Licensor may terminate this Agreement for material breach, including any prohibited use. Upon termination, Licensee must remove the affected recording from distribution and cease all further use of the Production.</li>
      </ul>

      <h2>7. Refunds and Payment</h2>
      <ul>
        <li>Payments are processed securely through Stripe or the site&rsquo;s payment processor.</li>
        <li>The buyer is responsible for entering correct contact and delivery information.</li>
        <li>Digital products are generally non-refundable once delivered, unless there is a technical issue with the file or a duplicate charge.</li>
      </ul>

      <h2>8. Disclaimers and Liability</h2>
      <p>
        The Production is licensed &ldquo;as is.&rdquo; Licensor&rsquo;s total
        liability under this Agreement is limited to the amount Licensee paid
        for the relevant license. Licensor is not liable for indirect,
        incidental, consequential, or punitive damages.
      </p>

      <h2>9. Governing Law</h2>
      <p>
        This Agreement is governed by the laws of the state in which Zae
        Moreno resides at the time of purchase, without regard to conflict-of-
        law principles.
      </p>

      <h2>10. Entire Agreement</h2>
      <p>
        This Agreement, together with the Terms of Service and Privacy Policy,
        constitutes the entire agreement between Licensor and Licensee
        regarding the Production. Any modification must be in writing and
        signed by both parties.
      </p>
    </LegalPage>
  );
}
