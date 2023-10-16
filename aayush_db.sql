-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 28, 2023 at 12:05 PM
-- Server version: 10.4.6-MariaDB
-- PHP Version: 7.3.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aayush_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`id`, `full_name`, `email`, `password`) VALUES
(1, 'test test', 'testtest@gmail.com', '$2b$10$zD9QeOTRoZ.2j.PrYz9GI.4r23IXoOryzZJuakqfz5x1ePFnqO3/S'),
(2, 'try', 'try@gmail.com', '$2b$10$wJONUphY5QWh1STFoE4Cb.O6Knc4N/yc9Rn/MlqRFHn3o8XWU0pJW'),
(3, 'Signin Test', 'signintest@gmail.com', '$2b$10$xFiN58ppXpcYnA9.TUlPv.zPPBNA9djOJNDkfe.Pr66J0kW3THqLW');

-- --------------------------------------------------------

--
-- Table structure for table `registration`
--

CREATE TABLE `registration` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `openingtime` time DEFAULT NULL,
  `closingtime` time DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `reg_state` varchar(20) DEFAULT 'hold',
  `menu` text NOT NULL,
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `registration`
--

INSERT INTO `registration` (`id`, `name`, `email`, `password`, `location`, `phone`, `openingtime`, `closingtime`, `image`, `description`, `reg_state`, `menu`, `latitude`, `longitude`) VALUES
(1, 'Himalayan Delights', 'himalayandelights@gmail.com', '$2b$10$ewlIU5whCBSi4AWXipozyuqO7HC./9F4ZVQE1.akt0p7dQyg0jg1S', 'Chabail, Kathmandu', '9846578476', '04:30:00', '23:00:00', 'image_1693164265320.jpg', 'Situated in the heart of Kathmandu, Himalayan Delights is a culinary journey through the majestic Himalayas. Our menu is inspired by the diverse cultures and flavors of Nepal\'s mountainous regions. Enjoy mouthwatering dishes made from fresh local ingredients while taking in the serene ambiance of our restaurant. The warm, rustic decor and soft traditional music create an atmosphere that transports you to the tranquil villages of the Himalayas. Whether you\'re savoring our signature momo dumplings, hearty dal bhat, or sipping on a cup of aromatic chai, every bite and sip tells a story of Nepal\'s culinary heritage. Join us for a dining experience that combines tradition, taste, and tranquility.', 'hold', '[\"menuImages_1693164265322.png\",\"menuImages_1693164265342.png\",\"menuImages_1693164265353.png\",\"menuImages_1693164265507.jpg\"]', 27.7195, 85.3472),
(2, 'Spice Haven', 'spicehaven@gmail.com', '$2b$10$UmzEPHiGlf5CNKvFxIeRPeApXkvzMzSiG4OntOx/M8Wl3k37xrXjy', 'Naya Thimi, Bhaktapur', '9846578534', '05:00:00', '12:10:00', 'image_1693164397512.jpeg', 'A fusion of traditional and contemporary Nepali cuisine. Spice Haven is a culinary gem in the bustling streets of Bhaktapur. Our chefs blend traditional Nepali spices with modern cooking techniques to create a unique dining experience. Step into our warm and inviting space to explore the rich tapestry of Nepali flavors. The restaurant\'s decor reflects the vibrant culture of Nepal, with colorful paintings and intricate woodwork adorning the walls. As you browse our extensive menu, you\'ll find a variety of dishes that showcase the depth of Nepali cuisine. From the fiery flavors of our chicken chhoila to the delicate tastes of our momo variations, every dish is a testament to our commitment to authenticity and innovation. Join us for an adventure through the heart of Nepal.', 'hold', '[\"menuImages_1693164397513.jpg\",\"menuImages_1693164397521.jpg\",\"menuImages_1693164397528.png\",\"menuImages_1693164397539.png\"]', 27.6728, 85.3845),
(3, 'Gorkha Tandoori Palace', 'tandooripalace@gmail.com', '$2b$10$eMWgmX4AszTR66mmf2aa4uCXitI.gRcainc7vWkym4TUO6oNpPs56', 'Pokhara, Kaski', '9845271907', '03:30:00', '23:00:00', 'image_1693164546393.jpeg', 'Savor the rich flavors of Gorkha cuisine in a royal setting. Indulge in regal dining at Gorkha Tandoori Palace, nestled in Pokhara\'s scenic landscape. Our restaurant is a tribute to the rich heritage of the Gorkha region. We serve delectable tandoori dishes and traditional specialties fit for kings and queens. Experience dining fit for royalty as you step into our opulent dining area adorned with ornate chandeliers and intricate carvings. Our tandoor ovens infuse our dishes with a smoky, charred flavor that sets us apart. From the tender tandoori chicken to the rich and creamy butter chicken, every bite is a symphony of flavors. Immerse yourself in the grandeur of Gorkha cuisine and the stunning views of Pokhara\'s natural beauty.', 'hold', '[\"menuImages_1693164546394.png\",\"menuImages_1693164546404.png\",\"menuImages_1693164546408.png\",\"menuImages_1693164546415.png\"]', 28.2118, 83.9917),
(4, 'Yeti Mountain Cafe', 'yetimountaincafe@gmail.com', '$2b$10$QwCnm6QtTjbscphxQd78TejeFUUgpzgMcIsbg7ZktaEYn75x6yyMK', 'Lukla, Solukhumbu', '9834274562', '04:45:00', '12:30:00', 'image_1693164686646.jpeg', 'A must-visit for trekkers, offering hearty meals with stunning mountain views. Yeti Mountain Cafe, perched in the Himalayan village of Lukla, offers not just food but an adventure for your taste buds. Our menu is a blend of hearty mountain cuisine and international delights. Enjoy your meals while gazing at the world\'s tallest peaks from our cozy cafe. The cafe\'s rustic charm is accentuated by wooden beams and traditional artwork. As you dine on dishes like yak steak and Sherpa stew, you can feel the warmth of our hospitality and the chill of the mountain air. Whether you\'re fueling up before a trek or simply enjoying a meal, Yeti Mountain Cafe offers an unforgettable dining experience high in the Himalayas.\n', 'approved', '[\"menuImages_1693164686646.png\",\"menuImages_1693164686659.png\",\"menuImages_1693164686670.png\",\"menuImages_1693164686676.png\"]', 27.69, 86.7286),
(5, 'Newari Spice House', 'newarispicehouse@gmail.com', '$2b$10$slcjyshG1o/OIK6gF1AvAOn4j.vRwT0kA94/DYrtLLJiMQKC7AIRa', 'Balkumari, Lalitpur ', '9807152673', '03:00:00', '23:30:00', 'image_1693164895477.jpeg', 'Discover the authentic taste of Newari cuisine in a traditional setting. Transport yourself to the ancient Newar heartland at Newari Spice House in Lalitpur. Our restaurant is a tribute to the rich culinary traditions of the Newar community. Savor the intricate flavors of Newari cuisine in a setting that echoes centuries of tradition. The restaurant\'s architecture mirrors the intricate woodwork and carvings found in Newar homes. As you explore our menu, you\'ll discover dishes like yomari and bara, each prepared with meticulous care and authenticity. The flavors are a harmonious blend of sweet, savory, and spicy, inviting you to savor every bite. Join us on a gastronomic journey that celebrates the heritage and flavors of Nepal\'s Newar community.', 'approved', '[\"menuImages_1693164895477.png\",\"menuImages_1693164895482.png\",\"menuImages_1693164895493.png\",\"menuImages_1693164895500.png\"]', NULL, NULL),
(6, 'test reg', 'test@gmail.com', '$2b$10$bPr31SBZp4jdXRpRwE/ZHODkUSVqNcSg3KYrdghK.HNYDB5Vbrj46', 'test', '9846575867', '06:00:00', '22:00:00', 'image_1695818193135.png', 'test', 'approved', '[\"menuImages_1695818193137.png\",\"menuImages_1695818193154.png\",\"menuImages_1695818193170.png\",\"menuImages_1695818193189.png\"]', 27.6825, 85.3718);

-- --------------------------------------------------------

--
-- Table structure for table `restaurant`
--

CREATE TABLE `restaurant` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `openingTime` time DEFAULT NULL,
  `closingTime` time DEFAULT NULL,
  `description` text DEFAULT NULL,
  `menu` text DEFAULT NULL,
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `restaurant`
--

INSERT INTO `restaurant` (`id`, `name`, `email`, `password`, `location`, `phone`, `image`, `openingTime`, `closingTime`, `description`, `menu`, `latitude`, `longitude`) VALUES
(1, 'Mustang Grill House', 'mustanggrill@gmail.com', '$2b$10$EQUi4yNtB5knAjiegrNIOu6Fx26IhYkz.9nxXMYQseJioA4oQrK7u', 'Jomsom, Mustang ', '9813694610', 'image_1693165087305.png', '05:30:00', '22:40:00', 'A grill house with a Mustang twist, offering local and international dishes. Journey to the mystical land of Mustang without leaving Jomsom at the Mustang Grill House. We specialize in grill dishes with a Mustang twist. The restaurant\'s rustic charm and Mustang-inspired decor create a unique dining experience. As you step inside, you\'ll be greeted by Tibetan prayer flags and traditional artifacts, setting the stage for a cultural and culinary adventure. Our grill menu features dishes like yak kebabs and thukpa, each infused with the bold flavors of the Mustang region. The hearty, robust tastes are a tribute to the rugged terrain and ancient traditions of this hidden Himalayan gem. Join us for a gastronomic journey through the enchanting land of Mustang.\n', '[\"menuImages_1693165087305.png\",\"menuImages_1693165087321.png\",\"menuImages_1693165087332.png\",\"menuImages_1693165087338.jpg\"]', 28.7843, 83.7331),
(2, 'Lakeside Breeze Cafe', 'lakesidebreeze@gmail.com', '$2b$10$YcI8RFoLnpnL25AcJDdIwuUpOVEmMEIze7vAgnKs/t/sCCdoeO64C', 'Fewa Lake, Pokhara', '9856100953', 'image_1693165194438.jpeg', '04:00:00', '23:40:00', 'Dine by the tranquil Fewa Lake, enjoying international and Nepali cuisine. Lakeside Breeze Cafe in Pokhara offers a serene dining experience by Fewa Lake. Our menu is a fusion of international and Nepali dishes, made with the freshest ingredients. Enjoy the gentle breeze and breathtaking lake views while you dine with us. The cafe\'s lakeside location provides an idyllic backdrop for your dining experience. As you explore our menu, you\'ll find dishes ranging from classic momo to international favorites like grilled salmon. Each dish is prepared with care, combining the flavors of Nepal with global culinary influences. Whether you\'re celebrating a special occasion or simply enjoying a leisurely meal, Lakeside Breeze Cafe invites you to savor the beauty of Fewa Lake and the flavors of Nepal.', '[\"menuImages_1693165194438.jpg\",\"menuImages_1693165194447.jpg\",\"menuImages_1693165194451.png\",\"menuImages_1693165194464.png\"]', 28.2214, 83.9571),
(3, 'Terai Treats', 'teraitreats@gmail.com', '$2b$10$C4o8F6Hs8i8IkPkHkarBZOvLJfd9GKoan1.2ZQ97WBWgCgp7iw3Xy', 'Birgunj, Parsa ', '9810269026', 'image_1693165309131.jpeg', '05:40:00', '23:20:00', 'Indulge in the flavors of the Terai region in a cozy atmosphere. Terai Treats in Birgunj is your gateway to the flavors of the Terai region. Our menu showcases the bold and spicy dishes that define Terai cuisine. Visit us to experience a symphony of flavors and aromas in a warm and welcoming atmosphere. The restaurant\'s decor pays homage to the lush Terai landscape, with earthy tones and bamboo accents. Our chefs craft dishes like sukuti and taas with precision, creating a sensory explosion of flavors. The generous use of spices and herbs reflects the Terai\'s agricultural abundance. Whether you\'re a fan of fiery heat or subtle sweetness, Terai Treats offers a culinary adventure that captures the essence of this vibrant region.\n', '[\"menuImages_1693165309132.png\",\"menuImages_1693165309145.png\",\"menuImages_1693165309147.png\",\"menuImages_1693165309150.png\"]', 26.9915, 84.8734),
(4, 'Newari Spice House', 'newarispicehouse@gmail.com', '$2b$10$slcjyshG1o/OIK6gF1AvAOn4j.vRwT0kA94/DYrtLLJiMQKC7AIRa', 'Balkumari, Lalitpur ', '9807152673', 'image_1693164895477.jpeg', '03:00:00', '23:30:00', 'Discover the authentic taste of Newari cuisine in a traditional setting. Transport yourself to the ancient Newar heartland at Newari Spice House in Lalitpur. Our restaurant is a tribute to the rich culinary traditions of the Newar community. Savor the intricate flavors of Newari cuisine in a setting that echoes centuries of tradition. The restaurant\'s architecture mirrors the intricate woodwork and carvings found in Newar homes. As you explore our menu, you\'ll discover dishes like yomari and bara, each prepared with meticulous care and authenticity. The flavors are a harmonious blend of sweet, savory, and spicy, inviting you to savor every bite. Join us on a gastronomic journey that celebrates the heritage and flavors of Nepal\'s Newar community.', '[\"menuImages_1693164895477.png\",\"menuImages_1693164895482.png\",\"menuImages_1693164895493.png\",\"menuImages_1693164895500.png\"]', 27.6713, 85.3407),
(26, 'test', 'test@gmail.com', '$2b$10$qus/nY9tnX4tk9PqiQwDxeuWsWBDvii5OY2D8mGj8ak/Y5EUJncnS', 'test', '9875678908', 'image_1695836433277.jpeg', '08:00:00', '23:20:00', 'testtt', '[\"menuImages_1695836433278.png\",\"menuImages_1695836433294.png\",\"menuImages_1695836433303.png\",\"menuImages_1695836433317.png\"]', 27.7195, 85.3472);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`) VALUES
(1, '1admin@gmail.com', '1admin'),
(2, '2admin@gmail.com', '2admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `registration`
--
ALTER TABLE `registration`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `restaurant`
--
ALTER TABLE `restaurant`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `registration`
--
ALTER TABLE `registration`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `restaurant`
--
ALTER TABLE `restaurant`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
