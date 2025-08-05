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

            return {
                ...response.content,
                createdAt,
            };
        }
        throw new Error(response.message || '사용자 정보를 불러오는데 실패했습니다.');
    }
};