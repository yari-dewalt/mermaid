import { it, describe, expect } from 'vitest';
import { parser } from './architectureParser.js';
import { ArchitectureDB } from './architectureDb.js';
describe('architecture diagrams', () => {
  let db: ArchitectureDB;
  beforeEach(() => {
    db = new ArchitectureDB();
    // @ts-expect-error since type is set to undefined we will have error
    parser.parser?.yy = db;
  });

  describe('architecture diagram definitions', () => {
    it('should handle the architecture keyword', async () => {
      const str = `architecture-beta`;
      await expect(parser.parse(str)).resolves.not.toThrow();
    });

    it('should handle a simple radar definition', async () => {
      const str = `architecture-beta
            service db
            `;
      await expect(parser.parse(str)).resolves.not.toThrow();
    });
  });

  describe('should handle TitleAndAccessibilities', () => {
    it('should handle title on the first line', async () => {
      const str = `architecture-beta title Simple Architecture Diagram`;
      await expect(parser.parse(str)).resolves.not.toThrow();
      expect(db.getDiagramTitle()).toBe('Simple Architecture Diagram');
    });

    it('should handle title on another line', async () => {
      const str = `architecture-beta
            title Simple Architecture Diagram
            `;
      await expect(parser.parse(str)).resolves.not.toThrow();
      expect(db.getDiagramTitle()).toBe('Simple Architecture Diagram');
    });

    it('should handle accessibility title and description', async () => {
      const str = `architecture-beta
            accTitle: Accessibility Title
            accDescr: Accessibility Description
            `;
      await expect(parser.parse(str)).resolves.not.toThrow();
      expect(db.getAccTitle()).toBe('Accessibility Title');
      expect(db.getAccDescription()).toBe('Accessibility Description');
    });

    it('should handle multiline accessibility description', async () => {
      const str = `architecture-beta
            accDescr {
                Accessibility Description
            }
            `;
      await expect(parser.parse(str)).resolves.not.toThrow();
      expect(db.getAccDescription()).toBe('Accessibility Description');
    });
  });

  describe('should handle service IDs starting with arrow direction letters', () => {
    it('should handle service ID starting with T', async () => {
      const str = `architecture-beta
            service TH(disk)[Storage]
            `;
      await expect(parser.parse(str)).resolves.not.toThrow();
    });

    it('should handle service ID starting with L', async () => {
      const str = `architecture-beta
            service LEFT(disk)[Storage]
            `;
      await expect(parser.parse(str)).resolves.not.toThrow();
    });

    it('should handle service ID starting with R', async () => {
      const str = `architecture-beta
            service RIGHT(disk)[Storage]
            `;
      await expect(parser.parse(str)).resolves.not.toThrow();
    });

    it('should handle service ID starting with B', async () => {
      const str = `architecture-beta
            service BOTTOM(disk)[Storage]
            `;
      await expect(parser.parse(str)).resolves.not.toThrow();
    });

    it('should still handle arrow directions in edges', async () => {
      const str = `architecture-beta
            service TH(disk)[Storage]
            service server(server)[Server]
            TH:T -- B:server
            `;
      await expect(parser.parse(str)).resolves.not.toThrow();
    });
  });
});
