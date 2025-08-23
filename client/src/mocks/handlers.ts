import { http, HttpResponse } from 'msw';

const API_BASE_URL = '/api';

// Mock data
let fixedExtensions = [
  { ext: 'exe', blocked: false, category: '실행파일' },
  { ext: 'sh', blocked: false, category: '스크립트' },
  { ext: 'bat', blocked: true, category: '배치파일' },
  { ext: 'cmd', blocked: false, category: '명령파일' },
  { ext: 'com', blocked: false, category: '실행파일' },
  { ext: 'dll', blocked: true, category: '라이브러리' },
  { ext: 'jar', blocked: false, category: 'Java' },
  { ext: 'js', blocked: false, category: '스크립트' },
  { ext: 'msi', blocked: false, category: '설치파일' },
  { ext: 'php', blocked: true, category: '웹스크립트' },
  { ext: 'py', blocked: false, category: 'Python' },
  { ext: 'rb', blocked: false, category: 'Ruby' },
  { ext: 'scr', blocked: false, category: '스크린세이버' },
  { ext: 'vbs', blocked: false, category: 'VBScript' },
  { ext: 'reg', blocked: false, category: '레지스트리' },
  { ext: 'ps1', blocked: false, category: 'PowerShell' },
];

let customExtensions = ['pdf', 'docx', 'zip'];

export const handlers = [
  // GET /api/blocklist/fixed
  http.get(`${API_BASE_URL}/blocklist/fixed`, () => {
    return HttpResponse.json({
      items: fixedExtensions,
      updatedAt: new Date().toISOString(),
    });
  }),

  // PATCH /api/blocklist/fixed
  http.patch(`${API_BASE_URL}/blocklist/fixed`, async ({ request }) => {
    const { updates } = await request.json() as { updates: Array<{ ext: string; blocked: boolean }> };
    
    updates.forEach(update => {
      const item = fixedExtensions.find(ext => ext.ext === update.ext);
      if (item) {
        item.blocked = update.blocked;
      }
    });

    return HttpResponse.json({ ok: true });
  }),

  // GET /api/blocklist/custom
  http.get(`${API_BASE_URL}/blocklist/custom`, () => {
    return HttpResponse.json({
      items: customExtensions.sort(),
      count: customExtensions.length,
      limit: 200,
    });
  }),

  // POST /api/blocklist/custom
  http.post(`${API_BASE_URL}/blocklist/custom`, async ({ request }) => {
    const { ext } = await request.json() as { ext: string };
    
    if (customExtensions.includes(ext)) {
      return HttpResponse.json(
        { message: 'Extension already exists' },
        { status: 400 }
      );
    }

    const fixedBlocked = fixedExtensions.find(fixed => fixed.ext === ext && fixed.blocked);
    if (fixedBlocked) {
      return HttpResponse.json(
        { message: 'Extension conflicts with blocked fixed extension' },
        { status: 400 }
      );
    }

    if (customExtensions.length >= 200) {
      return HttpResponse.json(
        { message: 'Maximum limit of 200 extensions reached' },
        { status: 400 }
      );
    }

    customExtensions.push(ext);
    return HttpResponse.json({ ext }, { status: 201 });
  }),

  // DELETE /api/blocklist/custom/:ext
  http.delete(`${API_BASE_URL}/blocklist/custom/:ext`, ({ params }) => {
    const { ext } = params;
    const index = customExtensions.indexOf(ext as string);
    
    if (index === -1) {
      return HttpResponse.json(
        { message: 'Extension not found' },
        { status: 404 }
      );
    }

    customExtensions.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
