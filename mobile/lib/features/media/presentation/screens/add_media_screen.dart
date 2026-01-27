
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../domain/media_types.dart';
import '../../data/media_repository.dart';

class AddMediaScreen extends ConsumerStatefulWidget {
  final MediaType mediaType;

  const AddMediaScreen({super.key, required this.mediaType});

  @override
  ConsumerState<AddMediaScreen> createState() => _AddMediaScreenState();
}

class _AddMediaScreenState extends ConsumerState<AddMediaScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _imageUrlController = TextEditingController();
  
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
    _status = _getDefaultStatus();
  }

  @override
  void dispose() {
    _titleController.dispose();
    _imageUrlController.dispose();
    _studioController.dispose();
    _authorController.dispose();
    _developerController.dispose();
    super.dispose();
  }

  List<String> _getStatusOptions() {
    switch (widget.mediaType) {
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
    return options.firstWhere((s) => s.contains('Plan'), orElse: () => options.first);
  }


  void _save() async {
    if (_formKey.currentState!.validate()) {
      try {
        final data = {
          'title': _titleController.text,
          'imageUrl': _imageUrlController.text.isEmpty ? null : _imageUrlController.text,
          'userStats': {
            'score': _score > 0 ? _score : null,
            'status': _status,
          },
        };

        // Add specific fields
        switch (widget.mediaType) {
          case MediaType.anime:
            if (_studioController.text.isNotEmpty) data['studio'] = _studioController.text;
            break;
          case MediaType.manga:
          case MediaType.lightNovel:
          case MediaType.fiction:
          case MediaType.nonFiction:
            if (_authorController.text.isNotEmpty) data['author'] = _authorController.text;
            break;
          case MediaType.game:
             if (_developerController.text.isNotEmpty) data['developer'] = _developerController.text;
            break;
          default:
            break;
        }

        await ref.read(mediaRepositoryProvider).create(widget.mediaType, data);
        if (mounted) {
          context.pop();
          // Refresh list
          switch (widget.mediaType) {
            case MediaType.anime: ref.invalidate(animeListProvider);
            case MediaType.manga: ref.invalidate(mangaListProvider);
            case MediaType.lightNovel: ref.invalidate(lightNovelListProvider);
            case MediaType.fiction: ref.invalidate(fictionListProvider);
            case MediaType.nonFiction: ref.invalidate(nonFictionListProvider);
            case MediaType.movie: ref.invalidate(movieListProvider);
            case MediaType.tvSeries: ref.invalidate(tvSeriesListProvider);
            case MediaType.game: ref.invalidate(gameListProvider);
          }
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Error: $e')),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(
        title: Text('Add ${widget.mediaType.displayName}'),
        actions: [
          TextButton(
            onPressed: _save, 
            child: Text('Save', style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: theme.colorScheme.primary,
            ))
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
              validator: (v) => v == null || v.isEmpty ? 'Title is required' : null,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _imageUrlController,
              decoration: const InputDecoration(
                labelText: 'Image URL',
                prefixIcon: Icon(Icons.image),
              ),
            ),
            const SizedBox(height: 16),
            
            // Type Specific Fields
            if (widget.mediaType == MediaType.anime) ...[
               TextFormField(
                controller: _studioController,
                decoration: const InputDecoration(
                  labelText: 'Studio',
                  prefixIcon: Icon(Icons.business),
                ),
              ),
              const SizedBox(height: 16),
            ],
            
            if (widget.mediaType == MediaType.manga || 
                widget.mediaType == MediaType.lightNovel ||
                widget.mediaType == MediaType.fiction ||
                widget.mediaType == MediaType.nonFiction) ...[
               TextFormField(
                controller: _authorController,
                decoration: const InputDecoration(
                  labelText: 'Author',
                  prefixIcon: Icon(Icons.person),
                ),
              ),
              const SizedBox(height: 16),
            ],

            if (widget.mediaType == MediaType.game) ...[
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
              onExpansionChanged: (val) => setState(() => _isStatsExpanded = val),
              children: [
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      DropdownButtonFormField<String>(
                        value: _status,
                        decoration: const InputDecoration(
                          labelText: 'Status',
                          prefixIcon: Icon(Icons.flag),
                        ),
                        items: _getStatusOptions()
                            .map((s) => DropdownMenuItem(value: s, child: Text(s)))
                            .toList(),
                        onChanged: (v) => setState(() => _status = v!),
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
