#!/bin/bash
# Script de preparação do projeto Node.js no Linux

PROJECT_DIR="/IS-PAT"  # Ajuste para o caminho do seu projeto

echo "➡️  Entrando no diretório do projeto..."
cd $PROJECT_DIR || exit 1

echo "➡️  Ajustando permissões do projeto..."
sudo chown -R $USER:$USER .

echo "➡️  Removendo node_modules e package-lock.json antigos..."
rm -rf node_modules package-lock.json

echo "➡️  Limpando cache do npm..."
npm cache clean --force

echo "➡️  Instalando todas as dependências..."
npm install

echo "➡️  Corrigindo vulnerabilidades automaticamente (não-breaking)..."
npm audit fix

echo "➡️  Listando pacotes desatualizados..."
npm outdated

echo "✅ Projeto preparado! Você pode rodar agora: npm start ou outro comando do seu projeto."

