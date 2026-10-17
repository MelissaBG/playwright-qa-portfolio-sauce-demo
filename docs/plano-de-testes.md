# Plano de Testes: Sauce Demo

**Sistema:** https://www.saucedemo.com
**Responsável:** Melissa Goulart
**Sprint:** Sprint de recuperação (iniciada em 13/10/2026)

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
| Formulário de checkout limpava o primeiro campo quando preenchido logo após a página abrir (WebKit) | Instabilidade da automação | Não se aplica | Corrigido na automação (16/10) |

**Lição registrada:** na primeira tentativa do CT-12, a finalização redirecionou para o login. A reprodução com sessão nova mostrou que a causa era a expiração da sessão, e não o carrinho vazio. Todo defeito é reproduzido antes de ser reportado.

**Instabilidade da automação no WebKit (15/10 e 16/10):** os testes do formulário de checkout falhavam de forma intermitente, porque o primeiro campo era apagado enquanto a página terminava de carregar. A investigação passou por três etapas:

1. Sincronizar a navegação e conferir cada campo após o preenchimento: a taxa de falha caiu de 20% para 4%.
2. A evidência do estado da página no momento da falha mostrou o primeiro campo vazio e os demais preenchidos, o que descartou a hipótese anterior.
3. Correção: digitação tecla a tecla e conferência dos três campos juntos, com nova tentativa controlada. Validado com 2 rodadas de 80 execuções no WebKit, sem falhas.

Não é um defeito do sistema para o usuário, e sim uma condição de tempo que afeta a automação.

## 6. Critérios de entrada e saída

**Entrada:** site acessível, usuários de teste disponíveis e cenários revisados.

**Saída:** todos os cenários de prioridade alta automatizados e passando no pipeline, sem defeito de severidade alta em aberto.

## 7. Cronograma

| Etapa | Entrega | Situação |
| --- | --- | --- |
| 1 | Gestão: quadro, milestone e issues | Concluído |
| 2 | Plano de testes | Concluído |
| 3 | Automação de carrinho e checkout | Concluído |
| 4 | Page Object Model | Concluído |
| 5 | Fixtures e login reaproveitado (storageState) | Concluído |
| 6 | Dados em JSON, variáveis de ambiente e tags | Planejado |
| 7 | Testes de API | Planejado |
| 8 | Teste híbrido: API e interface | Planejado |
| 9 | Mock de rede | Planejado |
| 10 | Pipeline e relatório público | Planejado |
| 11 | Testes visuais e de acessibilidade | Planejado |
| 12 | Reporte de bugs | Planejado |
| 13 | Estratégia e métricas | Planejado |
| 14 | README final | Planejado |
| 15 | Retrospectiva e divulgação | Planejado |