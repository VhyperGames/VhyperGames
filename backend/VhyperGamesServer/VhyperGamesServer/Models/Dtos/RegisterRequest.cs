﻿namespace VhyperGamesServer.Models.Dtos;

public class RegisterRequest
{
    public string Name { get; set; }
    public string Surname { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string Address { get; set; }

}