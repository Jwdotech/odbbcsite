export interface ParsedPrayer {
  name: string;
  requests: string[];
  isUnknown: boolean;
  isSymbolMarked?: boolean;
}

function normalizeName(name: string): string {
  return name
    .replace(/^@\s*/, "") // Remove @ marker
    .replace(/^(Bro\.?|Brother|Sis\.?|Sister|Ptr\.?|Pastor)\s*/i, "")
    .trim()
    .toLowerCase();
}

// Remove dates and times from text
function stripDateTimeFromLine(line: string): string {
  let cleaned = line;
  
  // Remove timestamps in various formats
  // HH:MM AM/PM format
  cleaned = cleaned.replace(/\b\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)\b/gi, "").trim();
  
  // HH:MM format (24-hour)
  cleaned = cleaned.replace(/\b\d{1,2}:\d{2}\b/g, "").trim();
  
  // Date formats: MM/DD/YYYY, MM/DD/YY, M/D/YYYY, etc.
  cleaned = cleaned.replace(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g, "").trim();
  
  // Date formats: DD-MM-YYYY, MM-DD-YYYY
  cleaned = cleaned.replace(/\b\d{1,2}-\d{1,2}-\d{2,4}\b/g, "").trim();
  
  // Full date formats: Jan 14, 2024 or January 14, 2024
  cleaned = cleaned.replace(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*.?\s+\d{1,2},?\s+\d{4}\b/gi, "").trim();
  
  // Day of week: Monday, Tuesday, etc.
  cleaned = cleaned.replace(/\b(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)(?:day)?\b/gi, "").trim();
  
  // ISO format: 2024-02-14
  cleaned = cleaned.replace(/\b\d{4}-\d{1,2}-\d{1,2}\b/g, "").trim();
  
  // Remove multiple spaces
  cleaned = cleaned.replace(/\s+/g, " ").trim();
  
  return cleaned;
}

// Find member names mentioned within text
function findMemberNamesInText(text: string, knownNames: string[]): string[] {
  const found: string[] = [];
  
  for (const memberName of knownNames) {
    const normalized = normalizeName(memberName);
    // Check if member name appears in the text (case-insensitive)
    const regex = new RegExp(`\\b${normalized}\\b`, "i");
    if (regex.test(text)) {
      found.push(memberName);
    }
  }
  
  return found;
}

// Check if line has symbol marker (@)
function hasSymbolMarker(line: string): boolean {
  return /^@\s+/.test(line.trim());
}

function isSenderName(line: string, knownNames: string[]): boolean {
  const trimmed = line.trim();

  // Only @ markers indicate a sender name line.
  return hasSymbolMarker(trimmed);
}

export function parsePrayer(
  text: string,
  knownNames: string[] = []
): ParsedPrayer[] {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

  const result: ParsedPrayer[] = [];
  let current: ParsedPrayer | null = null;
  let generalRequests: ParsedPrayer | null = null;

  for (const line of lines) {
    const isSender = isSenderName(line, knownNames);

    if (isSender) {
      // Start a new sender block
      const isMarked = hasSymbolMarker(line);
      const cleanName = line.replace(/^@\s*/, "").trim();
      const normalized = normalizeName(line);
      const normalizedKnown = knownNames.map((name) => normalizeName(name));
      
      const isUnknown =
        knownNames.length > 0 && !normalizedKnown.includes(normalized);

      current = {
        name: cleanName,
        requests: [],
        isUnknown,
        isSymbolMarked: isMarked,
      };

      result.push(current);
      generalRequests = null; // Reset general requests when we have a named sender
    } else {
      // This is a content line - strip dates and times
      const cleanedLine = stripDateTimeFromLine(line);
      
      // Skip if line becomes empty after stripping
      if (!cleanedLine) {
        continue;
      }

      let assigned = false;

      // Try to find member names mentioned in this prayer request
      const mentionedMembers = findMemberNamesInText(cleanedLine, knownNames);
      
      if (mentionedMembers.length > 0) {
        // Assign this prayer request to the first mentioned member
        const memberName = mentionedMembers[0];
        const normalized = normalizeName(memberName);
        
        // Find or create prayer entry for this member
        let memberPrayer = result.find(
          (p) => normalizeName(p.name) === normalized
        );
        
        if (!memberPrayer) {
          memberPrayer = {
            name: memberName,
            requests: [],
            isUnknown: false,
          };
          result.push(memberPrayer);
        }
        
        // Add request if not duplicate
        const exists = memberPrayer.requests.some(
          (request) => request.toLowerCase() === cleanedLine.toLowerCase()
        );
        if (!exists) {
          memberPrayer.requests.push(cleanedLine);
        }
        assigned = true;
      }

      // If not assigned to a member, add to current sender or general requests
      if (!assigned) {
        if (current) {
          // Add to current sender's requests
          const exists = current.requests.some(
            (request) => request.toLowerCase() === cleanedLine.toLowerCase()
          );

          if (!exists) {
            current.requests.push(cleanedLine);
          }
        } else {
          // No current sender, add to general requests
          if (!generalRequests) {
            generalRequests = {
              name: "Prayer Requests",
              requests: [],
              isUnknown: false,
            };
            result.push(generalRequests);
          }

          const exists = generalRequests.requests.some(
            (request) => request.toLowerCase() === cleanedLine.toLowerCase()
          );

          if (!exists) {
            generalRequests.requests.push(cleanedLine);
          }
        }
      }
    }
  }

  return result;
}
