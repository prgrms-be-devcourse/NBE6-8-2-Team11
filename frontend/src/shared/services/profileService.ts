import { apiClient } from './apiClient';
import { User } from '../../features/profile/types';

export const ProfileService = {
    fetchUserById: async (id: number) => {
        const response = await apiClient.get<User>(`/members/${id}`);
        if (response.success && response.content) {
            const rawCreatedAt = response.content.createdAt;

            const createdAt = Array.isArray(rawCreatedAt)
                ? new Date(rawCreatedAt[0], rawCreatedAt[1] - 1, rawCreatedAt[2])
                : new Date(rawCreatedAt);

            // Context의 memberType을 User 객체에 주입
            const savedMemberType = localStorage.getItem('memberType') as 'adopter' | 'shelter' | null;

            return {
                ...response.content,
                createdAt,
                // Context의 값이 있으면 사용, 없으면 백엔드 값(없을 예정), 없으면 기본값
                memberType: savedMemberType || response.content.memberType || 'adopter',
            };
        }
        throw new Error(response.message || '사용자 정보를 불러오는데 실패했습니다.');
    }
};