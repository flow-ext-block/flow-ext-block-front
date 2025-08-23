import { FixedExtensionsList } from '@/components/fixed-extensions-list';
import { CustomExtensionsList } from '@/components/custom-extensions-list';

export default function BlocklistPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <h1 className="text-2xl font-semibold text-gray-900">파일 확장자 차단 관리</h1>
            <p className="text-sm text-gray-600 mt-1">업로드 시 차단할 파일 확장자를 관리합니다</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FixedExtensionsList />
          <CustomExtensionsList />
        </div>
      </main>
    </div>
  );
}
