# Playwright QA Portfolio - Sauce Demo

Projeto de automação de testes com Playwright e TypeScript, cobrindo os fluxos de login, catálogo, carrinho e checkout do [Sauce Demo](https://www.saucedemo.com).

O projeto segue um plano de testes com análise de risco e técnicas de partição de equivalência e valor limite. Veja o [plano de testes](docs/plano-de-testes.md).

## Tecnologias

- Playwright Test
- TypeScript
- GitHub Actions
- GitHub Projects (gestão do trabalho)

## Como rodar

```bash
npm install
npx playwright install
npx playwright test
```

Antes dos testes, o projeto `setup` faz login uma vez e salva a sessão em `.auth/user.json`, reaproveitada pelos demais testes. Essa pasta não é versionada.

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
fixtures/
  index.ts               # entrega os Page Objects prontos aos testes
pages/                   # Page Objects: locators e ações de cada página
  LoginPage.ts
  InventoryPage.ts
  CartPage.ts
  CheckoutPage.ts
tests/
  auth.setup.ts          # login único e gravação da sessão (storageState)
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

## Decisões técnicas

- **Page Object Model:** locators e ações ficam nas classes de página; os testes contêm apenas o cenário e as verificações. Uma mudança de seletor é corrigida em um único lugar.
- **Fixtures customizadas:** os testes recebem as páginas prontas (`{ checkoutPage }`), sem criar objetos manualmente.
- **Login reaproveitado:** o login pela interface acontece uma vez por execução, via `storageState`. Os testes de login usam um navegador sem sessão, para validar o fluxo do zero.
- **Testes independentes:** cada teste roda em uma página isolada, o que permite execução em paralelo.
- **Instabilidade corrigida na causa, não com retry:** no WebKit, o primeiro campo do formulário de checkout era apagado quando preenchido logo após a página abrir, com falhas em até 20% das execuções. Após três etapas de investigação, a correção foi digitar tecla a tecla e conferir os três campos juntos antes de continuar, com nova tentativa controlada. Validado com 160 execuções sem falhas.

## Defeitos encontrados

Durante o teste exploratório, foram identificados comportamentos que serão reportados como issues, entre eles a possibilidade de concluir uma compra com o carrinho vazio (CT-12). A lista completa está na seção "Achados da exploração" do [plano de testes](docs/plano-de-testes.md).

## Autora

Melissa Goulart