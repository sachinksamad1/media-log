import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color _primaryColor = Color(0xFF6C63FF);
  static const Color _backgroundColor = Color(0xFF121212);
  static const Color _surfaceColor = Color(0xFF1E1E1E);
  static const Color _onSurfaceColor = Color(0xFFE0E0E0);

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: ColorScheme.dark(
        primary: _primaryColor,
        secondary: const Color(0xFF03DAC6),
        surface: _surfaceColor,
        onSurface: _onSurfaceColor,
      ),
      scaffoldBackgroundColor: _backgroundColor,
      textTheme: GoogleFonts.outfitTextTheme(
        ThemeData.dark().textTheme,
      ).apply(bodyColor: _onSurfaceColor, displayColor: _onSurfaceColor),
      appBarTheme: const AppBarTheme(
        backgroundColor: _backgroundColor,
        elevation: 0,
        centerTitle: true,
      ),
      cardTheme: CardThemeData(
        color: _surfaceColor,
        elevation: 4,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),

      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: _surfaceColor,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: _primaryColor),
        ),
      ),
    );
  }
}
