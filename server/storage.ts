import { type FixedExtension, type CustomExtension, type InsertFixedExtension, type InsertCustomExtension, type UpdateFixedExtension } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Fixed Extensions
  getFixedExtensions(): Promise<FixedExtension[]>;
  updateFixedExtensions(updates: UpdateFixedExtension[]): Promise<void>;
  
  // Custom Extensions
  getCustomExtensions(): Promise<{ items: string[], count: number, limit: number }>;
  addCustomExtension(extension: string): Promise<{ ext: string }>;
  deleteCustomExtension(extension: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private fixedExtensions: Map<string, FixedExtension>;
  private customExtensions: Set<string>;
  private readonly customExtensionsLimit = 200;

  constructor() {
    this.fixedExtensions = new Map();
    this.customExtensions = new Set();
    
    // Initialize with default fixed extensions
    const defaultExtensions = [
      { extension: 'exe', category: '실행파일' },
      { extension: 'sh', category: '스크립트' },
      { extension: 'bat', category: '배치파일' },
      { extension: 'cmd', category: '명령파일' },
      { extension: 'com', category: '실행파일' },
      { extension: 'dll', category: '라이브러리' },
      { extension: 'jar', category: 'Java' },
      { extension: 'js', category: '스크립트' },
      { extension: 'msi', category: '설치파일' },
      { extension: 'php', category: '웹스크립트' },
      { extension: 'py', category: 'Python' },
      { extension: 'rb', category: 'Ruby' },
      { extension: 'scr', category: '스크린세이버' },
      { extension: 'vbs', category: 'VBScript' },
      { extension: 'reg', category: '레지스트리' },
      { extension: 'ps1', category: 'PowerShell' },
    ];

    defaultExtensions.forEach(ext => {
      const fixedExt: FixedExtension = {
        id: randomUUID(),
        extension: ext.extension,
        blocked: false,
        category: ext.category,
        updatedAt: new Date(),
      };
      this.fixedExtensions.set(ext.extension, fixedExt);
    });
  }

  async getFixedExtensions(): Promise<FixedExtension[]> {
    return Array.from(this.fixedExtensions.values()).sort((a, b) => a.extension.localeCompare(b.extension));
  }

  async updateFixedExtensions(updates: UpdateFixedExtension[]): Promise<void> {
    updates.forEach(update => {
      const existing = this.fixedExtensions.get(update.extension);
      if (existing) {
        existing.blocked = update.blocked;
        existing.updatedAt = new Date();
      }
    });
  }

  async getCustomExtensions(): Promise<{ items: string[], count: number, limit: number }> {
    return {
      items: Array.from(this.customExtensions).sort(),
      count: this.customExtensions.size,
      limit: this.customExtensionsLimit,
    };
  }

  async addCustomExtension(extension: string): Promise<{ ext: string }> {
    if (this.customExtensions.size >= this.customExtensionsLimit) {
      throw new Error(`Maximum limit of ${this.customExtensionsLimit} extensions reached`);
    }
    
    if (this.customExtensions.has(extension)) {
      throw new Error('Extension already exists');
    }

    // Check if it conflicts with a blocked fixed extension
    const fixedExt = this.fixedExtensions.get(extension);
    if (fixedExt && fixedExt.blocked) {
      throw new Error('Extension conflicts with blocked fixed extension');
    }

    this.customExtensions.add(extension);
    return { ext: extension };
  }

  async deleteCustomExtension(extension: string): Promise<void> {
    if (!this.customExtensions.has(extension)) {
      throw new Error('Extension not found');
    }
    this.customExtensions.delete(extension);
  }
}

export const storage = new MemStorage();
