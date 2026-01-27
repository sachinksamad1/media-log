import 'package:dio/dio.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../core/network/api_client.dart';
import '../domain/media_types.dart';
import '../anime/data/anime_model.dart';
import '../manga/data/manga_model.dart';
import '../light_novel/data/light_novel_model.dart';
import '../fiction/data/fiction_model.dart';
import '../non_fiction/data/non_fiction_model.dart';
import '../movie/data/movie_model.dart';
import '../tv_series/data/tv_series_model.dart';
import '../game/data/game_model.dart';

part 'media_repository.g.dart';


class PaginatedResult<T> {
  final List<T> items;
  final String? nextCursor;

  PaginatedResult({required this.items, this.nextCursor});
}

class MediaRepository {
  final Dio _dio;

  MediaRepository(this._dio);

  /// Fetch paginated media items
  Future<PaginatedResult<T>> fetchMedia<T extends BaseMedia>(
    MediaType type, {
    int limit = 20,
    String? cursor,
    String? status,
  }) async {
    final queryParams = <String, dynamic>{'limit': limit};
    if (cursor != null) queryParams['cursor'] = cursor;
    if (status != null) queryParams['status'] = status;

    final response = await _dio.get(
      '/${type.apiPath}',
      queryParameters: queryParams,
    );

    final List<dynamic> data = response.data['data'];
    final meta = response.data['meta'] as Map<String, dynamic>?;
    final nextCursor = meta?['nextCursor'] as String?;

    return PaginatedResult(
      items: data.map((json) => _parseMedia<T>(type, json)).toList(),
      nextCursor: nextCursor,
    );
  }

  /// Fetch all items for a specific media type (Legacy helper)
  Future<List<T>> fetchAll<T extends BaseMedia>(MediaType type) async {
    // We can use the new method, but for now let's keep it simple as it was
    // The backend limits to 20 by default if no limit provided.
    // If we truly want ALL, we'd need to loop.
    // But existing code assumed it got a list. Let's rely on default behavior.
    final response = await _dio.get('/${type.apiPath}?limit=100'); // Bump limit
    final List<dynamic> data = response.data['data'];
    return data.map((json) => _parseMedia<T>(type, json)).toList();
  }

  /// Fetch a single item by ID
  Future<T> fetchById<T extends BaseMedia>(MediaType type, String id) async {
    final response = await _dio.get('/${type.apiPath}/$id');
    return _parseMedia<T>(type, response.data['data']);
  }

  /// Create a new media item
  Future<T> create<T extends BaseMedia>(MediaType type, Map<String, dynamic> data) async {
    final response = await _dio.post('/${type.apiPath}', data: data);
    return _parseMedia<T>(type, response.data['data']);
  }

  /// Update a media item
  Future<T> update<T extends BaseMedia>(MediaType type, String id, Map<String, dynamic> data) async {
    final response = await _dio.patch('/${type.apiPath}/$id', data: data);
    return _parseMedia<T>(type, response.data['data']);
  }

  /// Delete a media item
  Future<void> delete(MediaType type, String id) async {
    await _dio.delete('/${type.apiPath}/$id');
  }

  /// Parse JSON to appropriate media type
  T _parseMedia<T extends BaseMedia>(MediaType type, Map<String, dynamic> json) {
    switch (type) {
      case MediaType.anime:
        return Anime.fromJson(json) as T;
      case MediaType.manga:
        return Manga.fromJson(json) as T;
      case MediaType.lightNovel:
        return LightNovel.fromJson(json) as T;
      case MediaType.fiction:
        return Fiction.fromJson(json) as T;
      case MediaType.nonFiction:
        return NonFiction.fromJson(json) as T;
      case MediaType.movie:
        return Movie.fromJson(json) as T;
      case MediaType.tvSeries:
        return TvSeries.fromJson(json) as T;
      case MediaType.game:
        return Game.fromJson(json) as T;
    }
  }
}

@riverpod
MediaRepository mediaRepository(MediaRepositoryRef ref) {
  return MediaRepository(ref.watch(dioClientProvider));
}

// Type-specific list providers
@riverpod
Future<List<Anime>> animeList(AnimeListRef ref) async {
  final repo = ref.watch(mediaRepositoryProvider);
  return repo.fetchAll<Anime>(MediaType.anime);
}

@riverpod
Future<List<Manga>> mangaList(MangaListRef ref) async {
  final repo = ref.watch(mediaRepositoryProvider);
  return repo.fetchAll<Manga>(MediaType.manga);
}

@riverpod
Future<List<LightNovel>> lightNovelList(LightNovelListRef ref) async {
  final repo = ref.watch(mediaRepositoryProvider);
  return repo.fetchAll<LightNovel>(MediaType.lightNovel);
}

@riverpod
Future<List<Fiction>> fictionList(FictionListRef ref) async {
  final repo = ref.watch(mediaRepositoryProvider);
  return repo.fetchAll<Fiction>(MediaType.fiction);
}

@riverpod
Future<List<NonFiction>> nonFictionList(NonFictionListRef ref) async {
  final repo = ref.watch(mediaRepositoryProvider);
  return repo.fetchAll<NonFiction>(MediaType.nonFiction);
}

@riverpod
Future<List<Movie>> movieList(MovieListRef ref) async {
  final repo = ref.watch(mediaRepositoryProvider);
  return repo.fetchAll<Movie>(MediaType.movie);
}

@riverpod
Future<List<TvSeries>> tvSeriesList(TvSeriesListRef ref) async {
  final repo = ref.watch(mediaRepositoryProvider);
  return repo.fetchAll<TvSeries>(MediaType.tvSeries);
}

@riverpod
Future<List<Game>> gameList(GameListRef ref) async {
  final repo = ref.watch(mediaRepositoryProvider);
  return repo.fetchAll<Game>(MediaType.game);
}
