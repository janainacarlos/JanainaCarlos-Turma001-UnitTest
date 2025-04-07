const AnaliseDeDados = require('../src/analiseDeDados');

describe('Suite de Testes para a Classe AnaliseDeDados', () => {
  let analise;

  // Configuração inicial para cada teste
  beforeEach(() => {
    analise = new AnaliseDeDados([1, 2, 3, 4, 5]);
  });

  describe('Testes de Configuração e Manipulação de Dados', () => {
    test('Deve inicializar corretamente com os dados fornecidos', () => {
      expect(analise.dados).toEqual([1, 2, 3, 4, 5]);
    });

    test('Deve inicializar com array vazio quando nenhum dado é fornecido', () => {
      const instanciaVazia = new AnaliseDeDados();
      expect(instanciaVazia.dados).toEqual([]);
    });

    test('Deve adicionar novos itens ao conjunto de dados existente', () => {
      analise.adicionarDados([6, 7]);
      expect(analise.dados).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    test('Deve lançar exceção ao tentar adicionar dados que não são um array', () => {
      expect(() => analise.adicionarDados("dados inválidos")).toThrow("Os dados devem ser um array.");
    });

    test('Deve remover todos os dados quando limparDados é chamado', () => {
      analise.limparDados();
      expect(analise.dados).toEqual([]);
    });

    test('Deve retornar os dados em ordem crescente', () => {
      analise.adicionarDados([0, -1]);
      expect(analise.ordenarDados()).toEqual([-1, 0, 1, 2, 3, 4, 5]);
    });
  });

  describe('Testes de Métricas Estatísticas Básicas', () => {
    test('Cálculo de média para conjunto de dados não vazio', () => {
      expect(analise.calcularMedia()).toBe(3);
    });

    test('Retorno de null para média com conjunto vazio', () => {
      analise.limparDados();
      expect(analise.calcularMedia()).toBeNull();
    });

    test('Cálculo de mediana para conjunto com número ímpar de elementos', () => {
      expect(analise.calcularMediana()).toBe(3);
    });

    test('Cálculo de mediana para conjunto com número par de elementos', () => {
      analise.adicionarDados([6]);
      expect(analise.calcularMediana()).toBe(3.5);
    });

    test('Identificação de moda em conjunto unimodal', () => {
      analise.adicionarDados([1, 1]);
      expect(analise.calcularModa()).toEqual([1]);
    });

    test('Identificação de múltiplas modas em conjunto multimodal', () => {
      analise.limparDados();
      analise.adicionarDados([1, 2, 2, 3, 3]);
      expect(analise.calcularModa()).toEqual([2, 3]);
    });

    test('Cálculo preciso da variância amostral', () => {
      expect(analise.calcularVariancia()).toBe(2);
    });

    test('Cálculo do desvio padrão como raiz da variância', () => {
      expect(analise.calcularDesvioPadrao()).toBe(Math.sqrt(2));
    });

    test('Retorno de null para desvio padrão com dados vazios', () => {
      analise.limparDados();
      expect(analise.calcularDesvioPadrao()).toBeNull();
    });
  });

  describe('Testes de Valores Extremos e Normalização', () => {
    test('Identificação do valor mínimo no conjunto', () => {
      expect(analise.encontrarMinimo()).toBe(1);
    });

    test('Retorno de null para mínimo em conjunto vazio', () => {
      analise.limparDados();
      expect(analise.encontrarMinimo()).toBeNull();
    });

    test('Identificação do valor máximo no conjunto', () => {
      expect(analise.encontrarMaximo()).toBe(5);
    });

    test('Retorno de null para máximo em conjunto vazio', () => {
      analise.limparDados();
      expect(analise.encontrarMaximo()).toBeNull();
    });

    test('Normalização de dados para escala [0, 1]', () => {
      expect(analise.normalizarDados()).toEqual([0, 0.25, 0.5, 0.75, 1]);
    });

    test('Normalização retorna zeros para dados constantes', () => {
      analise.limparDados();
      analise.adicionarDados([5, 5, 5]);
      expect(analise.normalizarDados()).toEqual([0, 0, 0]);
    });

    test('Retorno de array vazio ao normalizar conjunto vazio', () => {
      analise.limparDados();
      expect(analise.normalizarDados()).toEqual([]);
    });
  });

  describe('Testes de Percentis e Operações Matemáticas', () => {
    test('Cálculo do primeiro quartil (percentil 25)', () => {
      expect(analise.calcularPercentil(25)).toBe(2);
    });

    test('Cálculo dos percentis extremos (0 e 100)', () => {
      expect(analise.calcularPercentil(0)).toBe(1);
      expect(analise.calcularPercentil(100)).toBe(5);
    });

    test('Retorno de null para percentis fora do intervalo [0, 100]', () => {
      expect(analise.calcularPercentil(-5)).toBeNull();
      expect(analise.calcularPercentil(105)).toBeNull();
    });

    test('Retorno de null para percentil em conjunto vazio', () => {
      analise.limparDados();
      expect(analise.calcularPercentil(50)).toBeNull();
    });

    test('Cálculo da soma total dos elementos', () => {
      expect(analise.calcularSoma()).toBe(15);
    });

    test('Cálculo do produto de todos os elementos', () => {
      expect(analise.calcularProduto()).toBe(120);
    });

    test('Produto retorna 1 para conjunto vazio (elemento neutro)', () => {
      analise.limparDados();
      expect(analise.calcularProduto()).toBe(1);
    });

    test('Cálculo da amplitude como diferença entre máximo e mínimo', () => {
      expect(analise.calcularAmplitude()).toBe(4);
    });

    test('Amplitude zero para conjunto vazio', () => {
      analise.limparDados();
      expect(analise.calcularAmplitude()).toBe(0);
    });
  });

  describe('Testes de Dispersão e Outliers', () => {
    test('Cálculo do coeficiente de variação', () => {
      const valorEsperado = (Math.sqrt(2) / 3) * 100;
      expect(analise.calcularCoeficienteVariacao()).toBeCloseTo(valorEsperado);
    });

    test('Retorno de NaN para coeficiente de variação em conjunto vazio', () => {
      analise.limparDados();
      expect(analise.calcularCoeficienteVariacao()).toBeNaN();
    });

    test('Remoção de outliers usando método IQR padrão', () => {
      analise.adicionarDados([100, -100]);
      analise.removerOutliers();
      expect(analise.dados).toEqual([1, 2, 3, 4, 5]);
    });

    test('Remoção de outliers com fator de tolerância personalizado', () => {
      const dadosComOutliers = new AnaliseDeDados([10, 10, 11, 12, 12, 13, 12, 100]);
      dadosComOutliers.removerOutliers(1.0);
      expect(dadosComOutliers.dados).toEqual([10, 10, 11, 12, 12, 13, 12]);
    });

    test('Remoção de outliers não falha com conjunto vazio', () => {
      analise.limparDados();
      expect(() => analise.removerOutliers()).not.toThrow();
      expect(analise.dados).toEqual([]);
    });
  });

  describe('Testes de Correlação entre Conjuntos', () => {
    test('Cálculo de correlação positiva perfeita', () => {
      const conjuntoCorrelacionado = [2, 4, 6, 8, 10];
      expect(analise.calcularCorrelacao(conjuntoCorrelacionado)).toBeCloseTo(1);
    });

    test('Retorno de null para conjuntos de tamanhos diferentes', () => {
      expect(analise.calcularCorrelacao([1, 2, 3])).toBeNull();
    });

    test('Retorno de null para correlação com conjunto vazio', () => {
      analise.limparDados();
      expect(analise.calcularCorrelacao([])).toBeNull();
    });

    test('Retorno de null quando não há variação nos dados', () => {
      const dadosConstantes = new AnaliseDeDados([5, 5, 5, 5]);
      const outroConstante = [3, 3, 3, 3];
      expect(dadosConstantes.calcularCorrelacao(outroConstante)).toBeNull();
    });
  });
});