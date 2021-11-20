export default {
  Meta: {
    title: 'Exevo Pan - Leilões',
    description: 'Filtre e explore chares de Tibia no Char Bazaar oficial!',
  },
  AuctionsGrid: {
    filterButtonLabel: 'Abrir menu de filtros',
    sortingButtonLabel: 'Defina um critério de ordenação',
    filter: 'filtro',
    filters: 'filtros',
    is: 'está',
    are: 'estão',
    active: 'ativo',
    noItemsPagination: 'Nenhum personagem',
    filterDrawerLabel: 'Formulário de filtros',
    descendingSwitchLabel: 'Ordenar por ordem decrescente',
    descending: 'Decrescente',
    sortModes: {
      auctionEnd: 'Fim do leilão',
      level: 'Level',
      price: 'Preço',
      priceBidded: 'Preço (apenas com lance)',
    },
    noAuctionFound: 'Desculpe, nenhum leilão foi encontrado',
    changeFilters: 'Mudar filtros',
    notFoundAlt: 'Nenhum personagem foi encontrado',
  },
  FilterDrawer: {
    title: 'Filtros',
    resetFilters: 'Resetar filtros',
    searchNicknameLabel: 'Procurar nickname',
    searchNicknameTooltip: "Regex habilitado! Exemplo: ['-.,]",
    vocationLabel: 'Vocação',
    green: 'Verde',
    yellow: 'Amarelo',
    serverLocationLabel: 'Localização do servidor',
    serverPlaceholder: 'Escolha um servidor',
    minSkillLabel: 'Skill level mínimo',
    imbuementsPlaceholder: 'Selecionar imbuements',
    allImbuementsButton: 'Todos os imbuements',
    rareItemsLabel: 'Items raros',
    rareItemsTooltip:
      'Se um item raro não estiver nesta lista é porque não há nenhum leilão com ele no momento.',
    rareItemsPlaceholder: 'Escolha um item',
    allItemsButton: 'Todos os items',
    miscLabel: 'Diversos',
    rareNicknamesTooltip:
      "Nicknames com caracteres especiais (äëïöüÿ'-.,), comprimento de 2-3 caracteres e letras maiúsculas consecutivas (e.g XVI)",
    rareNicknamesButton: 'Nicknames raros',
    soulwarTooltip:
      'Personagens com nivel 250+ e com a Soul War não completada',
    soulwarButton: 'Soulwar disponível',
    skullEmoji: 'caveira',
  },
}
