# Playwright QA Portfolio - Sauce Demo

Projeto de automação de testes com Playwright e TypeScript, cobrindo os fluxos de login, catálogo, carrinho e checkout do [Sauce Demo](https://www.saucedemo.com).

O projeto segue um plano de testes com análise de risco e técnicas de partição de equivalência e valor limite. Veja o [plano de testes](docs/plano-de-testes.md).

## Tecnologias

- Playwright Test
- TypeScript
- GitHub Actions

## Como rodar

```bash
npm install
npx playwright install
npx playwright test
```

Para acompanhar a execução passo a passo:

```bash
npx playwright test --ui
```

Para abrir o relatório da última execução:

```bash
npx playwright show-report
```

## Estrutura

```
docs/
  plano-de-testes.md     # escopo, riscos, cenários e achados
tests/
  ui/
    login.spec.ts        # CT-01 a CT-03
    checkout.spec.ts     # CT-04 a CT-11
```

## Cenários cobertos

Cada teste é executado em Chromium, Firefox e WebKit.

| ID | Funcionalidade | Cenário | Tipo |
| --- | --- | --- | --- |
| CT-01 | Login | Login com usuário válido | Positivo |
| CT-02 | Login | Login com usuário bloqueado | Negativo |
| CT-03 | Login | Login sem senha | Negativo |
| CT-04 | Catálogo | Ordenação por preço, do menor para o maior | Positivo |
| CT-05 | Carrinho | Adicionar produto atualiza o contador | Positivo |
| CT-06 | Carrinho | Remover produto esconde o contador | Positivo |
| CT-07 | Checkout | Compra completa com dados válidos | Positivo |
| CT-08 | Checkout | First Name vazio exibe erro | Negativo |
| CT-09 | Checkout | Last Name vazio exibe erro | Negativo |
| CT-10 | Checkout | Postal Code vazio exibe erro | Negativo |
| CT-11 | Checkout | Um caractere em cada campo é aceito | Positivo |

## Defeitos encontrados

Durante o teste exploratório, foram identificados comportamentos que serão reportados como issues, entre eles a possibilidade de concluir uma compra com o carrinho vazio (CT-12). A lista completa está na seção "Achados da exploração" do [plano de testes](docs/plano-de-testes.md).

## Autora

Melissa Goulart