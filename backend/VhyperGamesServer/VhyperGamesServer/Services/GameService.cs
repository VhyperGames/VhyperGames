using Microsoft.EntityFrameworkCore;
using VhyperGamesServer.Models.Database.Entities;
using VhyperGamesServer.Models.Dtos;
using VhyperGamesServer.Models.Database.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VhyperGamesServer.Models.Mappers;

namespace VhyperGamesServer.Services
{
    public class GameService
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly GameCardMapper _gameCardMapper;

        public GameService(UnitOfWork unitOfWork, GameCardMapper gameCardMapper)
        {
            _unitOfWork = unitOfWork;
            _gameCardMapper = gameCardMapper;
        }

        public async Task<List<GameCardDto>> FilterAndSortGamesAsync(GameFilterDto filter)
        {
            // Obtiene la lista de juegos filtrados y ordenados
            var games = await _unitOfWork.GameRepository.FilterAndSortGamesAsync(filter);

            // Mapea los juegos a GameCardDto
            var gameCardDtos = games.Select(game => new GameCardDto
            {
                Id = game.Id,
                Title = game.Title,
                Stock = game.Stock,
                Price = game.Price,
                // ImageUrl = game.ImageUrl
            }).ToList();

            return gameCardDtos;
        }

        public async Task<List<GameCardDto>> GetNewGamesRelease()
        {

           List<Game> games = await _unitOfWork.GameRepository.GetNewGamesRelease();
            List<GameCardDto> gameCards = [];

            foreach (var game in games)
            {
               gameCards.Add(_gameCardMapper.ToDto(game));
            }

            return gameCards;
        }

        public async Task<List<GameCardDto>> GetSaleGames()
        {
            var games = await _unitOfWork.GameRepository.GetSaleGames();

            // Mapea los juegos en oferta a GameCardDto
            var gameCardDtos = games.Select(game => new GameCardDto
            {
                Id = game.Id,
                Title = game.Title,
                Stock = game.Stock,
                Price = game.Price,
                 //ImageUrl = game.ImageUrl
            }).ToList();

            return gameCardDtos;
        }

        public async Task<List<string>> FilterAndSortGamesAsync()
        {
            return await _unitOfWork.GameRepository.GetAllTitles();
        }

        public async Task<Game> GetAsync(int id)
        {
            var game = await _unitOfWork.GameRepository.GetByIdAsync(id);

            if (game == null)
            {
                throw new KeyNotFoundException("El juego no se encontró.");
            }

            return game;
        }

        public async Task<GameCardDto> CreateGameAsync(CreateGameDto newGameDto)
        {
            var game = new Game
            {
                Title = newGameDto.Title,
                Description = newGameDto.Description,
                Genre = newGameDto.Genre,
                DrmFree = newGameDto.DrmFree,
                ReleaseDate = newGameDto.ReleaseDate,
                Price = newGameDto.Price,
                Stock = newGameDto.Stock
            };

            await _unitOfWork.GameRepository.InsertAsync(game);
            await _unitOfWork.SaveAsync(); // Esto ahora funcionará correctamente

            return new GameCardDto
            {
                Id = game.Id,
                Title = game.Title,
                Price = game.Price,
                Stock = game.Stock,
                ImageUrl = game.ImageGames?.FirstOrDefault()?.ImageUrl // Asumiendo que tendrás imágenes en el futuro
            };
        }



    }
}
