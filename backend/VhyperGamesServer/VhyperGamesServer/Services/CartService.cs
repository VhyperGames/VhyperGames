﻿using VhyperGamesServer.Models.Database.Entities;
using VhyperGamesServer.Models.Database.Repositories;
using VhyperGamesServer.Models.Dtos;
using VhyperGamesServer.Models.Mappers;
namespace VhyperGamesServer.Services;

public class CartService
{
    private readonly UnitOfWork _unitOfWork;
    private readonly CartMapper _cartMapper;

    public CartService(UnitOfWork unitOfWork, CartMapper cartMapper)
    {
        _unitOfWork = unitOfWork;
        _cartMapper = cartMapper;
    }

    public async Task<List<CartDto>> UpdateCart(List<CartDto> cartResponseDtos, int cartId)
    {
        Cart cart = await _unitOfWork.CartRepository.GetByIdCart(cartId);

        if (cart == null)
        {
            throw new KeyNotFoundException($"No se ha encontrado este {cartId}.");
        }

        foreach (CartDto gameDto in cartResponseDtos)
        {

            CartDetail cartDetail = cart.CartDetails.FirstOrDefault(cd => cd.GameId == gameDto.GameId);

            CartDetail newCartDetail = new CartDetail()
            {
                GameId = gameDto.GameId,
                Quantity = gameDto.Quantity,
            };

            cart.CartDetails.Add(newCartDetail);
            await _unitOfWork.CartDetailsRepository.InsertAsync(newCartDetail);
        }

        _unitOfWork.CartRepository.Update(cart);

        await _unitOfWork.SaveAsync();

        return _cartMapper.ToListCartResponseDto(cart.CartDetails);
    }

    public async Task<List<CartDto>> GetCartById(int cartId)
    {
        List<CartDetail> cartDetails = await _unitOfWork.CartDetailsRepository.GetByIdCart(cartId);

        if (cartDetails == null)
        {
            throw new KeyNotFoundException($"No se ha encontrado carrito con este id {cartId}.");
        }

        return _cartMapper.ToListCartResponseDto(cartDetails);
    }


    public async Task<List<CartGameDto>> GetCartGames(List<int> gameIds)
    {
        List<Game> games = new List<Game>();

        foreach (int id in gameIds)
        {
            games.Add(await _unitOfWork.GameRepository.GetByIdAsync(id, false, true));
        }

        return _cartMapper.ToListCartGameDto(games);
    }

    public async Task<List<CartDto>> MergeCart(List<CartDto> cartDtos, int cartId)
    {
        Cart cart = await _unitOfWork.CartRepository.GetByIdCart(cartId);

        if (cart == null)
        {
            throw new KeyNotFoundException($"No se ha encontrado este {cartId}.");
        }


        foreach (CartDto cartDto in cartDtos)
        {
            CartDetail cartDetail = cart.CartDetails.FirstOrDefault(c => c.GameId == cartDto.GameId);

            if (cartDetail == null)
            {
                cartDetail = new CartDetail()
                {
                    GameId = cartDto.GameId,
                    Quantity = cartDto.Quantity,
                };

                cart.CartDetails.Add(cartDetail);

            }
            else
            {
                cartDetail.Quantity += cartDto.Quantity;
            }
        }

        _unitOfWork.CartRepository.Update(cart);

        await _unitOfWork.SaveAsync();
        return _cartMapper.ToListCartResponseDto(cart.CartDetails);
    }
}
