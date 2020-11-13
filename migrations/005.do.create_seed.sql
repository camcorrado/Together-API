BEGIN;

TRUNCATE
    messages,
    conversations,
    profiles,
    users
    RESTART IDENTITY CASCADE;

INSERT INTO users (full_name, email, password, deactivated)
VALUES
    ('Korra Avatar', 'legendofkorra@email.com', '$2a$12$weAfhl/rteh4oMc8rMQiH.qhrm3sXVU6JJTcBfCdiaqlZnUkVMbfu', 'false'),
    ('Ellie Miller', 'lastofus@email.com', '$2a$12$Jur3HrrQY0.CCO2SnU8LqulN7Y3vBh07m4V0QzhGslPBEfzNDMdvy', 'true'),
    ('Kung Jin', 'mkx@email.com', '$2a$12$OdhAwdYLgEZI0ObLFHi98ug8IKDseZLioaPTS4UOb7s.H6L6awEZq', 'false'),
    ('Flea Chrono', 'chronotrigger@email.com', '$2a$12$O67fsySKta7Cm.jWa2njQubm7N9ijtlgAd7GKYoXNd2XxtMhV5OwK', 'false'),
    ('Birdo Birdo', 'yoshi@email.com', '$2a$12$P8FHCExnpFlW84GRBVllbO5b5CEhNlzSIvs6t0gUvpzMGns3ATxWO', 'false'),
    ('Quina Quen', 'finalfantasy@email.com', '$2a$12$weAfhl/rteh4oMc8rMQiH.qhrm3sXVU6JJTcBfCdiaqlZnUkVMbfu', 'false'),
    ('Lena Oxton', 'overwatch@email.com', '$2a$12$weAfhl/rteh4oMc8rMQiH.qhrm3sXVU6JJTcBfCdiaqlZnUkVMbfu', 'false'),
    ('Haruka Tenoh', 'sailormoon@email.com', '$2a$12$weAfhl/rteh4oMc8rMQiH.qhrm3sXVU6JJTcBfCdiaqlZnUkVMbfu', 'false'),
    ('Ruby Ruby', 'stevenuniverse@email.com', '$2a$12$weAfhl/rteh4oMc8rMQiH.qhrm3sXVU6JJTcBfCdiaqlZnUkVMbfu', 'false'),
    ('Queen Marceline', 'adventuretime@email.com', '$2a$12$weAfhl/rteh4oMc8rMQiH.qhrm3sXVU6JJTcBfCdiaqlZnUkVMbfu', 'false'),
    ('Marland Hoek', 'renandstimpy@email.com', '$2a$12$weAfhl/rteh4oMc8rMQiH.qhrm3sXVU6JJTcBfCdiaqlZnUkVMbfu', 'false'),
    ('Herb Kazzaz', 'bojack@email.com', '$2a$12$weAfhl/rteh4oMc8rMQiH.qhrm3sXVU6JJTcBfCdiaqlZnUkVMbfu', 'false'),
    ('Daryl Blubs', 'gravityfalls@email.com', '$2a$12$weAfhl/rteh4oMc8rMQiH.qhrm3sXVU6JJTcBfCdiaqlZnUkVMbfu', 'false'),
    ('Jack Morrison', 'overwatch2@email.com', '$2a$12$weAfhl/rteh4oMc8rMQiH.qhrm3sXVU6JJTcBfCdiaqlZnUkVMbfu', 'false');


INSERT INTO profiles (user_id, username, bio, profile_pic, interests, pronouns, geolocation, blocked_profiles, favorited_profiles, deactivated)
VALUES
    (1, 'LoK', 'Master of all four elements!', 'https://upload.wikimedia.org/wikipedia/en/d/db/Korra_The_Legend_of_Korra.jpg', '{"Activism", "Sports"}', 'She/Her', '20, -20', '{2, 3}', '{4, 5}', 'false'),
    (2, 'Zombae', 'I AM THE BRICK MASTER!', 'https://cdn.mos.cms.futurecdn.net/HbYPjx8LutUahfuSdoz5CN-970-80.jpg.webp', '{"Nightlife", "Reading", "Sports"}', 'She/Her', '10, -10', '{3, 4}', '{5, 6}', 'true'),
    (3, 'Bowman', 'Love to learn more about ya.', 'https://rei.animecharactersdatabase.com/uploads/chars/9180-682174789.jpg', '{"Drag", "Nightlife", "Sports"}', 'He/Him', '40, -40', '{4, 5}', '{6, 7}', 'false'),
    (4, 'Forget-Me-Not', 'Male, female, what is the difference?', 'https://vignette.wikia.nocookie.net/villains/images/c/c0/Villain_Flea_drawn_Chrono_Trigger.png/revision/latest/top-crop/width/360/height/450?cb=20130101140357', '{"Art", "Drag", "Fashion", "Music", "Nightlife", "Sports"}', 'He/Him', '50, -50', '{5, 6}', '{7, 8}', 'false'),
    (5, 'Birdetta', 'Just try not to get egg on your face.', 'https://upload.wikimedia.org/wikipedia/en/f/f9/Birdo-MP9.png', '{"Crafting", "Fashion", "Food", "Gaming", "Sports"}', 'It', '50, -50', '{6, 7}', '{8, 9}', 'false'),
    (6, 'Frogeater', 'Indulgence - I do what I want!', 'https://giantbomb1.cbsistatic.com/uploads/scale_small/0/3647/214959-kar_quina.jpg', '{"Art", "Food"}', 'She/Her/He/Him', '60, -60', '{7, 8}', '{9, 10}', 'false'),
    (7, 'Tracer', 'Cheers, love!', 'https://static2.thegamerimages.com/wordpress/wp-content/uploads/2019/07/Tracer-overwatch-little-known-facts-featured-image.jpg', '{"Activism", "Fashion", "Gaming", "Music", "Sports", "Tech"}', 'She/Her', '70, -70', '{8, 9}', '{10, 11}', 'false'),
    (8, 'Sailor Uranus', 'The Outer Planet of Wind, Guardian of the Heavens.', 'https://66.media.tumblr.com/f4a90d4a617669a463cea42aa7066f45/tumblr_psfq94zwXb1u1ycqw_540.jpg', '{"Activism", "Art", "Drag", "Fashion", "Nightlife", "Reading"}', 'She/Her', '80, -80', '{9, 10}', '{11, 12}', 'false'),
    (9, 'SapphireLuver', 'Iam an eternal flame, baby!', 'https://vignette.wikia.nocookie.net/steven-universe/images/f/fb/Su_ruby_new_3.png/revision/latest?cb=20200511204105', '{"Activism", "Fashion", "Food", "Sports"}', 'She/Her', '90, -90', '{10, 11}', '{12, 13}', 'false'),
    (10, 'BloodyFries', 'Vampires cannot beat ghosts.', 'https://w0.pngwave.com/png/582/210/marceline-the-vampire-queen-ice-king-adventure-frederator-studios-jake-png-clip-art.png', '{"Art", "Food", "Gaming", "Music", "Nightlife", "Reading"}', 'She/Her', '15, -15', '{11, 12}', '{13, 14}', 'false'),
    (11, 'Ren', 'They think I am crazy, but I know better.', 'https://vignette.wikia.nocookie.net/renandstimpy/images/9/9a/Ren-stimpy-25-anniversar-hp1y-1.png/revision/latest/top-crop/width/360/height/450?cb=20170521213617', '{"Crafting", "Food"}', 'He/Him', '25, -25', '{12, 13}', '{14, 1}', 'false'),
    (12, 'HorsinAround', 'Overweight human man with brown hair.', 'https://api.personality-database.com/profile_images/7051.png?credit_id=17990', '{"Art", "Drag", "Food", "Nightlife"}', 'He/Him', '35, -35', '{13, 14}', '{1, 2}', 'false'),
    (13, 'Sheriff Blubs', 'I am gonna take a long slow sip from my cup of coffee.', 'https://vignette.wikia.nocookie.net/disney/images/0/0f/S1e8_blubs_radio.png/revision/latest?cb=20170727061523', '{"Activism", "Food", "Nightlife", "Tech"}', 'He/Him', '45, -45', '{14, 1}', '{2, 3}', 'false'),
    (14, 'Soldier 76', 'Reporting for duty!', 'https://vignette.wikia.nocookie.net/overwatch/images/c/c3/Soldier76_portrait.png/revision/latest/scale-to-width-down/350?cb=20160429041023', '{"Activism", "Tech"}', 'He/Him', '55, -55', '{1, 2}', '{3, 4}', 'false');

INSERT INTO conversations (users, new_msg) 
VALUES
  ('{1, 4}', '2020-05-06 21:00:00'),
  ('{1, 12}', '2020-05-06 21:00:00'),
  ('{3, 6}', '2020-05-06 21:00:00'),
  ('{5, 8}', '2020-05-06 21:00:00'),
  ('{7, 10}', '2020-05-06 21:00:00'),
  ('{9, 13}', '2020-05-06 21:00:00'),
  ('{11, 14}', '2020-05-06 21:00:00'),
  ('{13, 2}', '2020-05-06 21:00:00');

INSERT INTO messages (conversation_id, user_id, content, date_created, msg_read) 
VALUES
  (1, 1, 'Hi!', '2020-05-05 21:00:00', 'true'),
  (1, 4, 'What Up?', '2020-05-06 21:00:00', 'false'),

  (2, 1, 'Hey', '2020-05-07 21:00:00', 'true'),
  (2, 12, 'How are ya?', '2020-05-08 21:00:00', 'false'),
  
  (3, 3, 'Yo!', '2020-05-05 21:00:00', 'true'),
  (3, 6, 'How rude...', '2020-05-06 21:00:00', 'false'),

  (4, 5, 'Hello!', '2020-05-05 21:00:00', 'true'),
  (4, 8, 'Haii', '2020-05-06 21:00:00', 'false'),

  (5, 7, 'Hiya', '2020-05-05 21:00:00', 'true'),
  (5, 10, 'Howdy', '2020-05-06 21:00:00', 'false'),

  (6, 9, 'You!', '2020-05-05 21:00:00', 'true'),
  (6, 13, 'Me..?', '2020-05-06 21:00:00', 'false'),

  (7, 11, 'Knock Knock', '2020-05-05 21:00:00', 'true'),
  (7, 14, 'Just ring the buzzer.', '2020-05-06 21:00:00', 'false'),

  (8, 13, 'Bye!', '2020-05-05 21:00:00', 'true'),
  (8, 2, 'But we never even said hello!', '2020-05-06 21:00:00', 'false');

  

COMMIT;
