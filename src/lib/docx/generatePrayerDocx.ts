import { ParsedPrayer } from "@/lib/ai/parser";
import { CALENDAR_DATA, MEMBERS_ABROAD, MISSIONARIES } from "@/lib/constants/prayerData";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
} from "docx";

export async function generatePrayerDocx(
  preview: ParsedPrayer[]
): Promise<Buffer> {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Get current month activities
  const currentMonth = new Date().getMonth();
  const currentMonthData = CALENDAR_DATA[currentMonth];
  const monthActivities = currentMonthData.events;

  // Categorize entries
  const prayerEntries: ParsedPrayer[] = [];

  preview.forEach((entry) => {
    if (entry.name.toLowerCase().includes("missionary") || entry.isUnknown) {
      return;
    }
    prayerEntries.push(entry);
  });

  const sisBelEntry = prayerEntries.find(
    (entry) => entry.name.trim().toLowerCase() === "sis. bel"
  );
  const bodyPrayerEntries = prayerEntries.filter(
    (entry) => entry.name.trim().toLowerCase() !== "sis. bel"
  );

  const prayerEntriesPerPage = 4;
  const prayerPageCount = bodyPrayerEntries.length
    ? Math.ceil(bodyPrayerEntries.length / prayerEntriesPerPage)
    : 0;
  const bodyPageCount = Math.max(prayerPageCount, 1);

  const splitIntoGroups = <T,>(items: T[], pageCount: number): T[][] => {
    const total = items.length;
    const baseSize = Math.floor(total / pageCount);
    let remainder = total % pageCount;
    const pages: T[][] = [];
    let startIndex = 0;

    for (let i = 0; i < pageCount; i += 1) {
      const size = baseSize + (remainder > 0 ? 1 : 0);
      remainder -= 1;
      pages.push(items.slice(startIndex, startIndex + size));
      startIndex += size;
    }

    return pages;
  };

  const missionaryGroups = splitIntoGroups(MISSIONARIES, bodyPageCount);

  const createBulletParagraph = (text: string) =>
    new Paragraph({
      text,
      bullet: { level: 0 },
      spacing: { after: 30 },
      indent: { left: 360 },
      keepLines: true,
    });

  const createHeaderParagraph = () =>
    new Paragraph({
      spacing: { after: 180 },
      children: [
        new TextRun({
          text: "PRAYER REQUEST 2026",
          bold: true,
          size: 32,
        }),
      ],
    });

  const sections: Paragraph[] = [];

  // Activity / Cover Page
  sections.push(createHeaderParagraph());

  sections.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "2026 CHURCH ACTIVITIES",
          bold: true,
          size: 26,
        }),
      ],
    })
  );

  sections.push(
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: currentMonthData.name.toUpperCase(),
          bold: true,
          size: 22,
        }),
      ],
    })
  );

  monthActivities.forEach((activity) => {
    const parts = activity.split(" ");
    const date = parts.shift() ?? "";
    const text = parts.join(" ");

    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${date} `,
            bold: true,
            size: 22,
          }),
          new TextRun({
            text,
            size: 22,
          }),
        ],
        spacing: { after: 30 },
        indent: { left: 360 },
      })
    );
  });

  sections.push(
    new Paragraph({
      text: "",
      spacing: { after: 80 },
    })
  );

  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "BRETHREN/LOVED ONES IN ABROAD",
          bold: true,
          size: 24,
        }),
      ],
      spacing: { before: 80, after: 40 },
    })
  );

  MEMBERS_ABROAD.forEach((member, index) => {
    sections.push(
      new Paragraph({
        text: `${index + 1}. ${member}`,
        spacing: { after: 18 },
        indent: { left: 360 },
      })
    );
  });

  sections.push(
    new Paragraph({
      text: "",
      spacing: { after: 60 },
    })
  );

  if (sisBelEntry) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "SIS. BEL PRAYER REQUEST",
            bold: true,
            size: 24,
          }),
        ],
        spacing: { before: 80, after: 40 },
      })
    );

    sisBelEntry.requests.forEach((request) => {
      sections.push(createBulletParagraph(request));
    });
  }

  for (let pageIndex = 0; pageIndex < bodyPageCount; pageIndex += 1) {
    sections.push(
      new Paragraph({
        text: "",
        pageBreakBefore: true,
      })
    );

    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "PRAYER LIST",
            bold: true,
            size: 24,
          }),
        ],
        spacing: { before: 80, after: 40 },
      })
    );

    const startIdx = pageIndex * prayerEntriesPerPage;
    const pageEntries = prayerEntries.slice(startIdx, startIdx + prayerEntriesPerPage);

    pageEntries.forEach((entry) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: entry.name,
              bold: true,
              size: 22,
            }),
          ],
          spacing: { before: 60, after: 18 },
        })
      );

      entry.requests.forEach((request) => {
        sections.push(createBulletParagraph(request));
      });
    });

    const missionaryGroup = missionaryGroups[pageIndex] ?? [];
    const previousCount = missionaryGroups
      .slice(0, pageIndex)
      .reduce((sum, prevGroup) => sum + prevGroup.length, 0);

    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "MISSIONARIES",
            bold: true,
            size: 22,
          }),
        ],
        spacing: { before: 80, after: 40 },
      })
    );

    sections.push(
      new Paragraph({
        spacing: { before: 20, after: 18 },
        indent: { left: 360 },
        children: [
          new TextRun({
            text: `Group ${pageIndex + 1}`,
            bold: true,
            size: 20,
          }),
        ],
      })
    );

    missionaryGroup.forEach((missionary, index) => {
      sections.push(
        new Paragraph({
          text: `${previousCount + index + 1}. ${missionary}`,
          spacing: { after: 18 },
          indent: { left: 540 },
          keepLines: true,
        })
      );
    });
  }

  sections.push(
    new Paragraph({
      text: "",
      pageBreakBefore: true,
    })
  );

  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "With faith, we lift these requests in prayer. 🙏",
          italics: true,
          size: 22,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
    })
  );

  const doc = new Document({
    sections: [
      {
        children: sections,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}
