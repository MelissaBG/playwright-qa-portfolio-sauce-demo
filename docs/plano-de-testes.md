# Plano de Testes: Sauce Demo

**Sistema:** https://www.saucedemo.com
**Responsável:** Melissa Goulart
**Sprint:** Sprint de recuperação (13/10 a 17/10/2026)

## 1. Escopo

**Dentro do escopo**

- Login: credenciais válidas, usuário bloqueado e campos obrigatórios.
- Catálogo: listagem e ordenação de produtos.
- Carrinho: adicionar, remover e contador do ícone.
- Checkout: formulário de dados, resumo e confirmação do pedido.

**Fora do escopo**

| Item | Motivo |
| --- | --- |
| Performance e carga | Site de demonstração público, sem ambiente dedicado nem metas de tempo de resposta |
| Segurança | Fora do objetivo do projeto e sem autorização para testes desse tipo em um site de terceiros |
| Integração com pagamento | O site não processa pagamento real |
| Compatibilidade mobile nativa | O site é apenas web; a visualização em telas pequenas pode ser avaliada nos testes visuais |
| Botão "Generate PDF order" | Funcionalidade secundária, que não impede a compra; avaliada apenas em teste exploratório |

## 2. Ambiente e dados de teste

- **Navegadores:** Chromium, Firefox e WebKit, via Playwright.
- **Usuários:** fornecidos pelo próprio site, senha `secret_sauce`.

| Usuário | Uso nos testes |
| --- | --- |
| `standard_user` | Fluxos com comportamento normal |
| `locked_out_user` | Cenário de usuário bloqueado |
| `problem_user` | Teste exploratório e reporte de bugs |

## 3. Matriz de riscos

| Funcionalidade | Probabilidade | Impacto | Prioridade | Mitigação |
| --- | --- | --- | --- | --- |
| Checkout | Média | Alto | Alta | Automatizar o caminho feliz e todas as validações do formulário; rodar a cada pull request |
| Login | Baixa | Alto | Alta | Automatizar cenários positivos e negativos; incluir na suíte `@smoke` |
| Carrinho | Média | Médio | Média | Automatizar adicionar, remover e contador |
| Ordenação do catálogo | Baixa | Baixo | Baixa | Cobrir uma ordenação na automação e as demais em teste exploratório |

**Critério:** impacto alto é tudo o que impede o cliente de comprar. Prioridade alta entra primeiro na automação.

## 4. Cenários de teste

| ID | Funcionalidade | Descrição | Técnica | Resultado esperado | Prioridade | Status |
| --- | --- | --- | --- | --- | --- | --- |
| CT-01 | Login | Login com usuário válido | Partição de equivalência | Redireciona para a página de produtos | Alta | Automatizado |
| CT-02 | Login | Login com usuário bloqueado | Partição de equivalência | Exibe "Epic sadface: Sorry, this user has been locked out." | Alta | Automatizado |
| CT-03 | Login | Login sem senha | Partição de equivalência | Exibe "Epic sadface: Password is required" | Alta | Automatizado |
| CT-04 | Catálogo | Ordenar por preço, do menor para o maior | Partição de equivalência | Produtos exibidos em ordem crescente de preço | Baixa | Automatizado |
| CT-05 | Carrinho | Adicionar um produto ao carrinho | Partição de equivalência | Contador do ícone do carrinho exibe 1 | Média | Automatizado |
| CT-06 | Carrinho | Remover o produto do carrinho | Partição de equivalência | Contador do ícone do carrinho desaparece | Média | Automatizado |
| CT-07 | Checkout | Compra completa com dados válidos | Partição de equivalência | Exibe "Thank you for your order!" | Alta | Automatizado |
| CT-08 | Checkout | Continuar com First Name vazio | Valor limite (0 caracteres) | Exibe "Error: First Name is required" | Alta | Automatizado |
| CT-09 | Checkout | Continuar com Last Name vazio | Valor limite (0 caracteres) | Exibe "Error: Last Name is required" | Alta | Automatizado |
| CT-10 | Checkout | Continuar com Postal Code vazio | Valor limite (0 caracteres) | Exibe "Error: Postal Code is required" | Alta | Automatizado |
| CT-11 | Checkout | Continuar com 1 caractere em cada campo | Valor limite (1 caractere) | Avança para o resumo do pedido | Média | Automatizado |
| CT-12 | Checkout | Iniciar checkout com o carrinho vazio | Partição de equivalência | Sem requisito definido. Em uma loja, o esperado é impedir o checkout sem itens | Média | Defeito encontrado |

**Observações**

- CT-08 a CT-11 formam a análise de valor limite dos campos do formulário: 0 caracteres deve ser rejeitado e 1 caractere deve ser aceito.
- CT-11 revelou que o Postal Code aceita qualquer caractere, sem validação de formato.
- CT-12: o site permite iniciar e concluir o checkout com o carrinho vazio (total $0.00). Comportamento reproduzido duas vezes; será reportado como defeito.

## 5. Achados da exploração (13/10 e 15/10)

| Achado | Tipo | Severidade sugerida | Situação |
| --- | --- | --- | --- |
| Checkout concluído com carrinho vazio (total $0.00) | Regra de negócio | Média | A reportar |
| Postal Code aceita qualquer caractere, sem validar formato | Validação | Média | A reportar |
| Ícone de erro aparece também nos campos preenchidos corretamente | Usabilidade | Baixa | A reportar |
| Descrição da Sauce Labs Bolt T-Shirt ("heather gray") não corresponde à imagem (camiseta preta) | Conteúdo | Baixa | A reportar |
| Formulário exibe apenas um erro por vez | Usabilidade | Baixa | Observação, sem defeito |
| Sessão expira após período de inatividade e redireciona ao login | Comportamento do sistema | Não se aplica | Esperado; testes devem ser independentes e curtos |

**Lição registrada:** na primeira tentativa do CT-12, a finalização redirecionou para o login. A reprodução com sessão nova mostrou que a causa era a expiração da sessão, e não o carrinho vazio. Todo defeito é reproduzido antes de ser reportado.

## 6. Critérios de entrada e saída

**Entrada:** site acessível, usuários de teste disponíveis e cenários revisados.

**Saída:** todos os cenários de prioridade alta automatizados e passando no pipeline, sem defeito de severidade alta em aberto.

## 7. Cronograma

| Data | Entrega |
| --- | --- |
| Ter 13/10 | Plano de testes e automação de carrinho e checkout |
| Qua 14/10 | Page Objects, fixtures e testes orientados a dados |
| Qui 15/10 | Testes de API e testes híbridos |
| Sex 16/10 | Pipeline, relatório, testes visuais e de acessibilidade, reporte de bugs |
| Sáb 17/10 | Estratégia, métricas, README final e retrospectiva |