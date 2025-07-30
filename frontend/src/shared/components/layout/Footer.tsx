import Link from 'next/link';
import Image from 'next/image';
import { BRAND_INFO, CONTACT_INFO } from '../../constants';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                <Image
                  src="/DolBomZ4.jpg"
                  alt="DolBömZ 로고"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-bold">{BRAND_INFO.name}</span>
            </div>
            <p className="text-gray-400">{BRAND_INFO.description}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">서비스</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/gallery" className="hover:text-white transition-colors">보호중인 동물 보기</Link></li>
              <li><Link href="/apply" className="hover:text-white transition-colors">입양 및 돌봄 신청</Link></li>
              <li><Link href="/profile" className="hover:text-white transition-colors">내정보</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">지원</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/help" className="hover:text-white transition-colors">도움말</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">문의하기</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">자주묻는질문</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">연락처</h3>
            <ul className="space-y-2 text-gray-400">
              <li>📧 {CONTACT_INFO.email}</li>
              <li>📞 {CONTACT_INFO.phone}</li>
              <li>📍 {CONTACT_INFO.address}</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 {BRAND_INFO.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 