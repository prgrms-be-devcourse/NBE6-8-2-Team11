/* 더미 데이터가 들어갈 경우에만 사용합니다. */

-- Member 테이블 더미 데이터
-- password는 BCryptPasswordEncoder로 인코딩된 값이어야 합니다. (예: 'password123' -> '$2a$10$...')
INSERT INTO member (member_email, member_password, member_name, member_phone, member_role, created_at)
VALUES ('user1@example.com', '$2a$10$LgL4qLhG2M.B3Z4mP3qX.e.O3B.Q.C.C.N.U.R.A.Q.I.E.F.E.I.D.M.A.C.M.O.K.0', '김철수', '010-1111-2222', 'USER', NOW());

INSERT INTO member (member_email, member_password, member_name, member_phone, member_role, created_at)
VALUES ('hello@world.com', '$ex_member_password', '홍길동', '010-7777-7777', 'USER', NOW());

INSERT INTO member (member_email, member_password, member_name, member_phone, member_role, created_at)
VALUES ('shelter@example.com', '$2a$10$LgL4qLhG2M.B3Z4mP3qX.e.O3B.Q.C.C.N.U.R.A.Q.I.E.F.E.I.D.M.A.C.M.O.K.0', '행복보호소관리자', '010-3333-4444', 'USER', NOW());
-- 실제 비밀번호는 암호화하여 사용해야 합니다. 위 예시는 임시 값입니다.

-- Shelter 테이블 더미 데이터 (프론트엔드 Mock 데이터 참고)
INSERT INTO shelter (shelter_name, shelter_address, shelter_city, shelter_state, shelter_zip_code, shelter_phone, created_at)
VALUES ('사랑의 동물보호소', '서울시 강남구 테헤란로 123', '서울', '강남구', '06123', '02-1234-5678', NOW());

INSERT INTO shelter (shelter_name, shelter_address, shelter_city, shelter_state, shelter_zip_code, shelter_phone, created_at)
VALUES ('희망의 동물보호소', '서울시 서초구 서초대로 456', '서울', '서초구', '06678', '02-2345-6789', NOW());

-- Pet 테이블 더미 데이터 (프론트엔드 Mock 데이터 참고)
INSERT INTO pet (pet_name, pet_species, pet_age, pet_gender, pet_description, pet_image_url, shelter_id, member_id)
VALUES ('멍멍이', 'dog', 3, 'MALE', '활발하고 친근한 강아지입니다. 산책을 좋아하고 아이들과 잘 어울립니다.', 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop', 1, 2);

INSERT INTO pet (pet_name, pet_species, pet_age, pet_gender, pet_description, pet_image_url, shelter_id, member_id)
VALUES ('나비', 'cat', 2, 'FEMALE', '조용하고 우아한 고양이입니다. 창가에서 햇볕을 즐기며 독립적인 성격을 가지고 있습니다.', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop', 2, 2);

-- PetStatus 더미 데이터 (PetStatusType.AVAILABLE_FOR_ADOPTION, ADOPTED, AVAILABLE_FOR_CARE, CARE_IN_PROGRESS, CARE_COMPLETED)
INSERT INTO pet_status (pet_status_type, pet_id) VALUES ('AVAILABLE_FOR_ADOPTION', 1);
INSERT INTO pet_status (pet_status_type, pet_id) VALUES ('AVAILABLE_FOR_ADOPTION', 2);