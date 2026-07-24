#!/usr/bin/env bash
#
# Deploy do Site Institucional Suplavia
# -------------------------------------
# Fluxo: commita mudanças locais (se houver) -> push no GitHub -> atualiza o VPS
#        (git no diretório montado no container nginx; reflete na hora, sem downtime).
#
# Uso:
#   ./deploy.sh                      # commita mudanças e publica
#   ./deploy.sh "mensagem do commit" # com mensagem personalizada
#
# Config do servidor: copie .deploy.env.example -> .deploy.env e ajuste
# (o .deploy.env NÃO é versionado, para não expor o IP/usuário no repo público).
#
set -euo pipefail
cd "$(dirname "$0")"

# --- Configuração (via .deploy.env, com defaults) ---
[ -f .deploy.env ] && source .deploy.env
SERVER="${SERVER:-}"
SERVER_DIR="${SERVER_DIR:-/root/site_institucional_suplavia}"
BRANCH="${BRANCH:-main}"
CONTAINER="${CONTAINER:-suplavia-site}"
URL="${URL:-https://www.suplavia.com.br}"

if [ -z "$SERVER" ]; then
  echo "✗ Defina SERVER em .deploy.env (ex.: SERVER=root@SEU_IP)." >&2
  echo "  Dica: cp .deploy.env.example .deploy.env  (e edite)" >&2
  exit 1
fi

echo "▶ Deploy do site Suplavia"

# 1) Commit local (se houver mudanças)
if [ -n "$(git status --porcelain)" ]; then
  MSG="${1:-Atualiza site institucional}"
  echo "  • commitando mudanças locais: \"$MSG\""
  git add -A
  git commit -q -m "$MSG"
else
  echo "  • sem mudanças locais para commitar"
fi

# 2) Push para o GitHub
echo "  • push -> origin/$BRANCH"
git push -q origin "$BRANCH"

# 3) Atualiza o servidor (git no dir montado no container; nginx serve na hora)
echo "  • atualizando o servidor ($SERVER)"
ssh "$SERVER" "cd '$SERVER_DIR' && git fetch -q --depth 1 origin '$BRANCH' && git reset -q --hard 'origin/$BRANCH' && echo '    sincronizado em '\$(git rev-parse --short HEAD)"

# 4) Verificação rápida do conteúdo servido
echo "  • verificando conteúdo servido"
ssh "$SERVER" "docker exec '$CONTAINER' wget -qO- http://127.0.0.1/ 2>/dev/null | grep -o '<title>[^<]*</title>' | head -1" \
  || echo "    (aviso: não consegui ler o título do container)"

echo "✓ Deploy concluído -> $URL"
