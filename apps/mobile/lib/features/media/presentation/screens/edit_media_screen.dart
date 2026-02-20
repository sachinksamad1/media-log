import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../domain/media_types.dart';
import '../../data/media_repository.dart';
import '../../anime/data/anime_model.dart';
import '../../manga/data/manga_model.dart';
import '../../game/data/game_model.dart';

class EditMediaScreen extends ConsumerStatefulWidget {
  final BaseMedia media;

  const EditMediaScreen({super.key, required this.media});

  @override
  ConsumerState<EditMediaScreen> createState() => _EditMediaScreenState();
}

class _EditMediaScreenState extends ConsumerState<EditMediaScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _titleController;

  File? _selectedImage;
  final ImagePicker _picker = ImagePicker();

  Future<void> _pickImage() async {
    final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
    if (image != null) {
      if (mounted) {
        setState(() {
          _selectedImage = File(image.path);
        });
      }
    }
  }

  // Specific fields controllers
  final _studioController = TextEditingController(); // Anime
  final _authorController = TextEditingController(); // Manga/Book
  final _developerController = TextEditingController(); // Game

  double _score = 0;
  late String _status;
  bool _isStatsExpanded = false;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.media.title);

    _score = widget.media.userStats?.score ?? 0;
    _status = widget.media.userStats?.status ?? _getDefaultStatus();
    _isStatsExpanded =
        widget.media.userStats != null &&
        widget.media.userStats!.status != null;

    // Type Specific initialization
    if (widget.media is Anime) {
      final anime = widget.media as Anime;
      if (anime.studio != null) {
        _studioController.text = anime.studio!;
      }
    } else if (widget.media is Manga) {
      final manga = widget.media as Manga;
      if (manga.author != null) {
        _authorController.text = manga.author!;
      }
    } else if (widget.media is Game) {
      final game = widget.media as Game;
      if (game.developer != null) {
        _developerController.text = game.developer!;
      }
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _studioController.dispose();
    _authorController.dispose();
    _developerController.dispose();
    super.dispose();
  }

  List<String> _getStatusOptions() {
    switch (widget.media.mediaType) {
      case MediaType.anime:
      case MediaType.movie:
      case MediaType.tvSeries:
        return ['Watching', 'Plan to Watch', 'Completed', 'Dropped', 'Paused'];
      case MediaType.manga:
      case MediaType.lightNovel:
      case MediaType.fiction:
      case MediaType.nonFiction:
        return ['Reading', 'Plan to Read', 'Completed', 'Dropped', 'Paused'];
      case MediaType.game:
        return ['Playing', 'Plan to Play', 'Completed', 'Dropped', 'Paused'];
    }
  }

  String _getDefaultStatus() {
    final options = _getStatusOptions();
    return options.firstWhere(
      (s) => s.contains('Plan'),
      orElse: () => options.first,
    );
  }

  void _save() async {
    if (_formKey.currentState!.validate()) {
      try {
        final data = {
          'title': _titleController.text,
          'userStats': {'score': _score > 0 ? _score : null, 'status': _status},
        };

        // Add specific fields
        switch (widget.media.mediaType) {
          case MediaType.anime:
            if (_studioController.text.isNotEmpty) {
              data['studio'] = _studioController.text;
            }
            break;
          case MediaType.manga:
          case MediaType.lightNovel:
          case MediaType.fiction:
          case MediaType.nonFiction:
            if (_authorController.text.isNotEmpty) {
              data['author'] = _authorController.text;
            }
            break;
          case MediaType.game:
            if (_developerController.text.isNotEmpty) {
              data['developer'] = _developerController.text;
            }
            break;
          default:
            break;
        }

        final updatedMedia = await ref
            .read(mediaRepositoryProvider)
            .update(
              widget.media.mediaType,
              widget.media.id,
              data,
              imageFile: _selectedImage,
            );

        if (mounted) {
          // Go back, optionally returning the updated media so detail screen can refresh
          context.pop(updatedMedia);

          // Refresh list for the media type
          switch (widget.media.mediaType) {
            case MediaType.anime:
              ref.invalidate(animeListProvider);
            case MediaType.manga:
              ref.invalidate(mangaListProvider);
            case MediaType.lightNovel:
              ref.invalidate(lightNovelListProvider);
            case MediaType.fiction:
              ref.invalidate(fictionListProvider);
            case MediaType.nonFiction:
              ref.invalidate(nonFictionListProvider);
            case MediaType.movie:
              ref.invalidate(movieListProvider);
            case MediaType.tvSeries:
              ref.invalidate(tvSeriesListProvider);
            case MediaType.game:
              ref.invalidate(gameListProvider);
          }
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text('Error: $e')));
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('Edit ${widget.media.mediaType.displayName}'),
        actions: [
          TextButton(
            onPressed: _save,
            child: Text(
              'Save',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
                color: theme.colorScheme.primary,
              ),
            ),
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _titleController,
              decoration: const InputDecoration(
                labelText: 'Title',
                prefixIcon: Icon(Icons.title),
              ),
              validator: (v) =>
                  v == null || v.isEmpty ? 'Title is required' : null,
            ),
            const SizedBox(height: 16),
            GestureDetector(
              onTap: _pickImage,
              child: Container(
                height: 200,
                decoration: BoxDecoration(
                  color: theme.colorScheme.surfaceContainerHighest,
                  borderRadius: BorderRadius.circular(12),
                  // If image is picked, show it
                  image: _selectedImage != null
                      ? DecorationImage(
                          image: FileImage(_selectedImage!),
                          fit: BoxFit.cover,
                        )
                      : (widget.media.imageUrl != null
                            ? DecorationImage(
                                image: NetworkImage(widget.media.imageUrl!),
                                fit: BoxFit.cover,
                              )
                            : null),
                ),
                child: _selectedImage == null && widget.media.imageUrl == null
                    ? const Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.add_photo_alternate, size: 48),
                            SizedBox(height: 8),
                            Text('Tap to select image'),
                          ],
                        ),
                      )
                    : null,
              ),
            ),
            const SizedBox(height: 16),

            // Type Specific Fields
            if (widget.media.mediaType == MediaType.anime) ...[
              TextFormField(
                controller: _studioController,
                decoration: const InputDecoration(
                  labelText: 'Studio',
                  prefixIcon: Icon(Icons.business),
                ),
              ),
              const SizedBox(height: 16),
            ],

            if (widget.media.mediaType == MediaType.manga ||
                widget.media.mediaType == MediaType.lightNovel ||
                widget.media.mediaType == MediaType.fiction ||
                widget.media.mediaType == MediaType.nonFiction) ...[
              TextFormField(
                controller: _authorController,
                decoration: const InputDecoration(
                  labelText: 'Author',
                  prefixIcon: Icon(Icons.person),
                ),
              ),
              const SizedBox(height: 16),
            ],

            if (widget.media.mediaType == MediaType.game) ...[
              TextFormField(
                controller: _developerController,
                decoration: const InputDecoration(
                  labelText: 'Developer',
                  prefixIcon: Icon(Icons.code),
                ),
              ),
              const SizedBox(height: 16),
            ],

            // User Stats Section
            ExpansionTile(
              title: const Text('My Status'),
              initiallyExpanded: _isStatsExpanded,
              onExpansionChanged: (val) =>
                  setState(() => _isStatsExpanded = val),
              children: [
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      DropdownButtonFormField<String>(
                        initialValue: _getStatusOptions().contains(_status)
                            ? _status
                            : null,
                        decoration: const InputDecoration(
                          labelText: 'Status',
                          prefixIcon: Icon(Icons.flag),
                        ),
                        items: _getStatusOptions()
                            .map(
                              (s) => DropdownMenuItem(value: s, child: Text(s)),
                            )
                            .toList(),
                        onChanged: (v) {
                          if (v != null) {
                            setState(() => _status = v);
                          }
                        },
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          const Icon(Icons.star_border),
                          const SizedBox(width: 12),
                          Text('Score: ${_score.toInt()}/10'),
                        ],
                      ),
                      Slider(
                        value: _score,
                        min: 0,
                        max: 10,
                        divisions: 10,
                        label: _score.round().toString(),
                        onChanged: (v) => setState(() => _score = v),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
