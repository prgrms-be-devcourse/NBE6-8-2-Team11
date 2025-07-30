/* 더미 데이터가 들어갈 경우에만 사용합니다. */

-- Member 테이블 더미 데이터
-- password는 BCryptPasswordEncoder로 인코딩된 값이어야 합니다. (예: 'password123' -> '$2a$10$...')
INSERT INTO member (member_email, member_password, member_name, member_phone, member_role, created_at)
VALUES ('user1@example.com', '$2a$10$LgL4qLhG2M.B3Z4mP3qX.e.O3B.Q.C.C.N.U.R.A.Q.I.E.F.E.I.D.M.A.C.M.O.K.0', '김철수', '010-1111-2222', 'USER', NOW());

INSERT INTO member (member_email, member_password, member_name, member_phone, member_role, created_at)
VALUES ('shelter@example.com', '$2a$10$LgL4qLhG2M.B3Z4mP3qX.e.O3B.Q.C.C.N.U.R.A.Q.I.E.F.E.I.D.M.A.C.M.O.K.0', '행복보호소관리자', '010-3333-4444', 'USER', NOW());

INSERT INTO shelter (shelter_id, shelter_name, shelter_address, shelter_city, shelter_state, shelter_zip_code, shelter_phone, created_at) VALUES
(1, '사랑의 동물보호소', '서울시 강남구 테헤란로 123', '서울', '강남구', '06123', '02-1234-5678', '2024-01-01T00:00:00'),
(2, '희망의 동물보호소', '서울시 서초구 서초대로 456', '서울', '서초구', '06678', '02-2345-6789', '2024-01-02T00:00:00'),
(3, '따뜻한 동물보호소', '경기도 성남시 분당구 정자로 789', '성남', '분당구', '13579', '031-3456-7890', '2024-01-03T00:00:00');

INSERT INTO pet (pet_name, pet_species, pet_age, pet_gender, pet_description, pet_image_url, shelter_id, member_id) VALUES
( '멍멍이', 'dog', 3, 'MALE', '활발하고 친근한 강아지입니다. 산책을 좋아하고 아이들과 잘 어울립니다.', 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop', 1, 2),
( '나비', 'cat', 2, 'FEMALE', '조용하고 우아한 고양이입니다. 창가에서 햇볕을 즐기며 독립적인 성격을 가지고 있습니다.', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop', 2, 2),
( '토토', 'rabbit', 1, 'MALE', '귀엽고 순한 토끼입니다. 당근을 좋아하고 깔끔한 환경을 선호합니다.', 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=300&fit=crop', 3, 2),
( '초코', 'dog', 5, 'FEMALE', '성숙하고 안정적인 성격의 대형견입니다. 경비견으로도 적합합니다.', 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=400&h=300&fit=crop', 1, 2),
( '미미', 'cat', 4, 'FEMALE', '사교적이고 장난스러운 고양이입니다. 다른 동물들과도 잘 어울립니다.', 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&h=300&fit=crop', 2, 2),
( '앵구', 'bird', 2, 'MALE', '예쁜 노래를 부르는 새입니다. 깨끗한 케이지에서 잘 살 수 있습니다.', 'https://images.unsplash.com/photo-1693218722743-eba71402ab37?w=400&h=300&fit=crop', 3, 2);

-- 모든 동물을 '입양 가능' 상태로 초기화
INSERT INTO pet_status (pet_status_type, pet_id) VALUES
('AVAILABLE_FOR_ADOPTION', 1),
('AVAILABLE_FOR_ADOPTION', 2),
('AVAILABLE_FOR_ADOPTION', 3),
('AVAILABLE_FOR_ADOPTION', 4),
('AVAILABLE_FOR_ADOPTION', 5),
('AVAILABLE_FOR_ADOPTION', 6);