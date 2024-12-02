using VhyperGamesServer.Models.Database.Entities;
using VhyperGamesServer.Models.Database.Repositories;
using VhyperGamesServer.Models.Dtos;
using VhyperGamesServer.Models.Mappers;

namespace VhyperGamesServer.Services;

public class AdminGameService
{
    UnitOfWork _unitOfWork { get; set; }
    AdminMapper _adminMapper { get; set; }

    private readonly ImageService _imageService;

    private readonly SmartSearchService _smartSearchService;

    public AdminGameService(AdminMapper adminMapper, UnitOfWork unitOfWork, ImageService imageService, SmartSearchService smartSearchService)    
    {
        _adminMapper = adminMapper;
        _unitOfWork = unitOfWork;
        _imageService = imageService;
        _smartSearchService = smartSearchService;
    }

    public async Task<List<AdminGameDto>> GetListGame()
    {
        List<Game> games = await _unitOfWork.GameRepository.GetAllGamesAsync();
        return _adminMapper.ToListAdminGameDto(games);
    }

    public async Task PostNewImages(List<IFormFile> images, List<string> alt, string title)
    {
        ArgumentNullException.ThrowIfNull(images);
        ArgumentNullException.ThrowIfNull(title);

        Game game = await _unitOfWork.GameRepository.GetGameByTitle(title);

        for (int i = 0; i < images.Count; i++)
        {

            string altText = images[i].Name + "_" + i;

            if (alt != null && alt[i] != null)
            {
                altText = alt[i];
            }

            ImageRequestDto imageRequestDto = new ImageRequestDto()
            {
                File = images[i],
                AltText = altText
            };

           await _imageService.InsertAsync(imageRequestDto, game.Id);
        }
    }

    public async Task<string> PostNewGame(AdminFormGameDto adminFormGameDto)
    {
        if (adminFormGameDto == null)
        {
            throw new ArgumentNullException("Los parametros no pueden ser nulos.");
        }

        Game game = new Game()
        {
            Title = adminFormGameDto.Title,
            Price = adminFormGameDto.Price,
            Stock = adminFormGameDto.Stock,
            GameRequirementsId = adminFormGameDto.GameRequirementsId,
            Description = adminFormGameDto.Description,
            Sinopsis = adminFormGameDto.Sinopsis,
            Genre = adminFormGameDto.Genre,
            DrmFree = adminFormGameDto.DrmFree,
            ReleaseDate = adminFormGameDto.ReleaseDate,
        };

        await _unitOfWork.GameRepository.InsertAsync(game);
        await _unitOfWork.SaveAsync();

        return game.Title;
    }

    public async Task<AdminFormGameDto> GetFormGame(int gameId)
    {
        Game game = await _unitOfWork.GameRepository.GetByIdAsync(gameId, false, true);

        if (game == null)
        {
            throw new KeyNotFoundException($"No se encontró un juego con el ID {gameId}.");
        }

        return _adminMapper.ToAdminFormGameDto(game);
    }

    public async Task PutGame(AdminFormGameDto adminFormGameDto, List<IFormFile> images, List<string> alt)
    {
        if (adminFormGameDto == null)
        {
            throw new ArgumentNullException("El objeto AdminFormGameDto no puede ser nulo.");
        }

        Game game = await _unitOfWork.GameRepository.GetByIdAsync(adminFormGameDto.Id, false, true);

        if (game == null)
        {
            throw new KeyNotFoundException($"No se encontró un juego con el ID {adminFormGameDto.Id}.");
        }

        if (adminFormGameDto.Title != null && adminFormGameDto.Title != "" && adminFormGameDto.Title != game.Title) {
            game.Title = adminFormGameDto.Title;
        }

        if (adminFormGameDto.Price != 0 && adminFormGameDto.Price != game.Price)
        {
            game.Price = adminFormGameDto.Price;
        }

        if (adminFormGameDto.Stock != game.Stock)
        {
            game.Stock = adminFormGameDto.Stock;
        }

        if (adminFormGameDto.GameRequirementsId != 0 && adminFormGameDto.GameRequirementsId != game.GameRequirementsId)
        {
            game.GameRequirementsId = adminFormGameDto.GameRequirementsId;
        }

        if (adminFormGameDto.Description != null && adminFormGameDto.Description != "" && adminFormGameDto.Description != game.Description)
        {
            game.Description = adminFormGameDto.Description;
        }

        if (adminFormGameDto.Sinopsis != null && adminFormGameDto.Sinopsis != "" && adminFormGameDto.Sinopsis != game.Sinopsis)
        {
            game.Sinopsis = adminFormGameDto.Sinopsis;
        }

        if (adminFormGameDto.Genre != game.Genre)
        {
            game.Genre = adminFormGameDto.Genre;
        }

        if (adminFormGameDto.DrmFree != game.DrmFree)
        {
            game.DrmFree = adminFormGameDto.DrmFree;
        }

        if (adminFormGameDto.ReleaseDate != game.ReleaseDate)
        {
            game.ReleaseDate = adminFormGameDto.ReleaseDate;
        }

        if (images != null && alt != null)
        {
            List<ImageGame> imagesBack = await _imageService.GetImagesByGameIdAsync(game.Id);

            if ((images.Count == imagesBack.Count) && (images.Count == alt.Count))
            {
                for (int i = 0; i < images.Count; i++)
                {
                    IFormFile file = images[i];
                    ImageGame existingImage = imagesBack[i];
                    string text = alt[i];

                    await _imageService.UpdateAsync2(file, text, existingImage.Id);
                }
            }
        }

        await _unitOfWork.SaveAsync();
    }

    public async Task<List<AdminGameDto>> GetGameBySearch(string search)
    {
        List<Game> games = new List<Game>();

        if (string.IsNullOrWhiteSpace(search))
        {
            throw new ArgumentException("La búsqueda no puede estar vacía.");
        }

        Game game = await _unitOfWork.GameRepository.GetGameByTitle(search);

        if (game != null && game.Title == search)
        {
            games.Add(game);

        } else
        {
            IEnumerable<string> matchedTitles = _smartSearchService.Search(search);

            if (matchedTitles != null && matchedTitles.Any())
            {
                games = await _unitOfWork.GameRepository.GetGamesByTitles(matchedTitles);
            }

        }

        List<AdminGameDto> adminGames = _adminMapper.ToListAdminGameDto(games);

        return adminGames;
    }

}
