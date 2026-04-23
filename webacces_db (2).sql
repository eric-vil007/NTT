-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-04-2026 a las 13:26:18
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `webacces_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `chat_mensajes`
--

CREATE TABLE `chat_mensajes` (
  `id` int(11) NOT NULL,
  `emisor_id` int(11) NOT NULL,
  `receptor_id` int(11) NOT NULL,
  `mensaje` text NOT NULL,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `chat_mensajes`
--

INSERT INTO `chat_mensajes` (`id`, `emisor_id`, `receptor_id`, `mensaje`, `fecha_envio`) VALUES
(54, 13, 12, 'Como vas down?', '2026-03-11 19:49:36'),
(139, 13, 12, 'dsadsadasdas', '2026-03-11 20:04:05'),
(161, 12, 1, 'dsadasdas', '2026-03-11 20:13:19'),
(162, 12, 5, 'BFSHSFGH', '2026-03-11 20:13:53'),
(163, 12, 5, 'JOLAAAAÇ', '2026-03-11 20:14:04'),
(164, 13, 12, 'despedido', '2026-03-11 20:14:06'),
(165, 13, 12, 'a su casa', '2026-03-11 20:14:08'),
(166, 12, 5, 'NUNCA ME CONTRATASTE', '2026-03-11 20:14:16'),
(167, 12, 1, 'HNGGHFN', '2026-03-11 20:16:49'),
(168, 12, 1, 'HNDHGNH', '2026-03-11 20:30:40'),
(169, 12, 1, 'Maricon', '2026-03-12 07:30:54'),
(170, 13, 12, 'sas', '2026-04-15 08:05:34'),
(171, 12, 1, 'fdsfdsfdsfdsfsdfsdfdsfdsfdsfdsfdsfdsfdsfdsfsdfsdfdsfdsfdsfdsfdsfdsfdsfdsfsdfsdfdsfdsfdsfdsfdsfdsfdsfdsfsdfsdfdsfdsfdsfdsfdsfdsfdsfdsfsdfsdfdsfdsfdsfdsfdsfdsfdsfdsfsdfsdfdsfdsfdsfdsfdsfdsfdsfdsfsdfsdfdsfdsfdsfdsfdsfdsfdsfdsfsdfsdfdsfdsfdsfds', '2026-04-20 07:42:23'),
(172, 12, 1, 'dsadsa', '2026-04-20 08:46:06');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tareas`
--

CREATE TABLE `tareas` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Pendiente',
  `dateFinished` date DEFAULT NULL,
  `is_completed` tinyint(1) DEFAULT 0,
  `startTime` time DEFAULT NULL,
  `finalTime` time DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tareas`
--

INSERT INTO `tareas` (`id`, `name`, `descripcion`, `status`, `dateFinished`, `is_completed`, `startTime`, `finalTime`, `usuario_id`) VALUES
(18, 'COGER CARROS', 'TENGO QUE COGER CARROS Y NO SE POR DONDE EMPEZAR', 'Finalizada', '2026-03-11', 1, '20:54:29', '20:54:40', 12),
(19, 'Prueba', 'dsdsafdsfds', 'Finalizada', '2026-03-23', 1, '08:30:45', '10:00:28', 12),
(20, 'sass', 'dsfdsfdsfds', 'Finalizada', '2026-04-16', 1, '13:08:36', '13:08:51', 12),
(21, 'dsadsadsa', 'fdsfdsfds', 'Finalizada', '2026-04-16', 1, '13:08:46', '13:08:54', 12),
(22, 'fdsfsfds', 'gfdgdgfdgd', 'Finalizada', '2026-04-16', 1, '13:08:47', '13:08:57', 12),
(23, 'fdsfdsfds', 'fdsfdsfdsfdsfds', 'Finalizada', '2026-04-16', 1, '13:09:07', '13:09:14', 12),
(24, 'fdsfdsfds', 'fdsfdsfds', 'Finalizada', '2026-04-16', 1, '13:09:06', '13:09:12', 12),
(27, 'fdsfdsf', 'dsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfs', 'Finalizada', '2026-04-16', 1, '13:34:26', '13:34:28', 12),
(28, 'dsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfs', 'dsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfs', 'Finalizada', '2026-04-16', 1, '13:34:43', '13:34:46', 12),
(30, 'dsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfd', 'dsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfs', 'Finalizada', '2026-04-20', 1, '09:37:17', '09:37:23', 12),
(33, 'dsdsada', 'dsadsadsad', 'Pendiente', NULL, 0, '00:00:00', '00:00:00', 12);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `nombre_completo` varchar(255) DEFAULT NULL,
  `rol` enum('trabajador','tutor','admin','empresa') NOT NULL,
  `empresa` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL DEFAULT '1234',
  `permiso_crear` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `nombre_completo`, `rol`, `empresa`, `password`, `permiso_crear`) VALUES
(11, 'admin', NULL, 'admin', NULL, '1234', 1),
(12, 'trabajador', NULL, 'trabajador', NULL, '1234', 1),
(13, 'tutor', NULL, 'tutor', NULL, '1234', 1),
(14, 'empresa', NULL, 'empresa', NULL, '1234', 1),
(15, 'ivan', NULL, 'trabajador', NULL, '1234', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `chat_mensajes`
--
ALTER TABLE `chat_mensajes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `emisor_id` (`emisor_id`),
  ADD KEY `receptor_id` (`receptor_id`);

--
-- Indices de la tabla `tareas`
--
ALTER TABLE `tareas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `chat_mensajes`
--
ALTER TABLE `chat_mensajes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=173;

--
-- AUTO_INCREMENT de la tabla `tareas`
--
ALTER TABLE `tareas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `chat_mensajes`
--
ALTER TABLE `chat_mensajes`
  ADD CONSTRAINT `chat_mensajes_ibfk_1` FOREIGN KEY (`emisor_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `tareas`
--
ALTER TABLE `tareas`
  ADD CONSTRAINT `tareas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
