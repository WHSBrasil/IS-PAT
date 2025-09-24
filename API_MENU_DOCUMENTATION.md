
# Parâmetro Menu - Documentação

## Visão Geral
Todas as rotas da aplicação agora suportam o parâmetro `menu` que permite controlar a exibição da interface completa ou simplificada.

## Como Usar

### Interface Completa (Padrão)
```
https://[seu-repl].repl.co/
https://[seu-repl].repl.co/tombamento
https://[seu-repl].repl.co/classificacoes
```

### Interface Sem Menu (Para Embedding/Modal)
```
https://[seu-repl].repl.co/?menu=false
https://[seu-repl].repl.co/tombamento?menu=false
https://[seu-repl].repl.co/classificacoes?menu=false
https://[seu-repl].repl.co/alocacao?menu=false
https://[seu-repl].repl.co/transferencia?menu=false
https://[seu-repl].repl.co/manutencao?menu=false
```

## Casos de Uso

### 1. Embedding em iFrame
```html
<iframe 
  src="https://[seu-repl].repl.co/tombamento?menu=false" 
  width="100%" 
  height="600">
</iframe>
```

### 2. Modal/Popup em Aplicação Externa
```javascript
window.open(
  'https://[seu-repl].repl.co/classificacoes?menu=false',
  'popup',
  'width=800,height=600'
);
```

### 3. Integração com Aplicação Externa
```javascript
// Carregar página sem menu em div
fetch('https://[seu-repl].repl.co/alocacao?menu=false')
  .then(response => response.text())
  .then(html => {
    document.getElementById('container').innerHTML = html;
  });
```

## Comportamento

- **menu=false**: Remove sidebar e header, exibe apenas o conteúdo da página com padding
- **menu=true** ou **sem parâmetro**: Exibe interface completa com sidebar e header
- O parâmetro é case-sensitive (deve ser minúsculo)

## Rotas Disponíveis

| Rota | Descrição | Com Menu | Sem Menu |
|------|-----------|----------|----------|
| `/` | Dashboard | `/?menu=true` | `/?menu=false` |
| `/classificacoes` | Classificações | `/classificacoes` | `/classificacoes?menu=false` |
| `/tombamento` | Tombamento | `/tombamento` | `/tombamento?menu=false` |
| `/alocacao` | Alocação | `/alocacao` | `/alocacao?menu=false` |
| `/transferencia` | Transferências | `/transferencia` | `/transferencia?menu=false` |
| `/manutencao` | Manutenção | `/manutencao` | `/manutencao?menu=false` |
