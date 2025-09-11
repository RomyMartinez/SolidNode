# API Node.js com SOLID

- [ X ] Estrutura do projeto
- [ X ] Integração com Prisma ORM
- [ X ] Caso de uso e design patterns
- [ X ] Design patterns & Testes
- [ ] Implementando casos de uso
- [ ] Controllers & Testes E2E
- [ ] Refresh Token & RBAC
- [ ] CI/CD da aplicação

## Sobre o projeto

- GymPass style app
- Working with SOLID principles in Node.js

## Requisitos Funcionais

- [ X ] It should be possible to register a user
- [ X ] It should be possible to authenticate a user
- [ ] It should be possible to get user profile logged
- [ ] It should be possible to get number of check-ins for a user
- [ ] It should be possible to the user search nearby gyms
- [ ] It should be possible to the user search gyms by name
- [ ] It should be possible to the user check-in at a gym
- [ ] It should be possible to validate a check-in
- [ ] It should be register an gym

## Regras de Negócios

- [ X ] A user should not be able to register with an email that is already in use
- [ ] A user should not be able to check-in more than once in the same day
- [ ] A user should not be able to check-in in a gym that is more than 100 meters away from his location
- [ ] A check-in should be validate only until 20 minutes after its creation
- [ ] A check-in can be validated only by an user with admin role
- [ ] Only an user with admin role can register a gym

## Requisitos Não Funcionais

- [ X ] A password must be encrypted
- [ X ] The database must be PostgreSQL
- [ ] All data listing must be paginated with 20 items per page
- [ ] The authentication must be stateless, using JWT
