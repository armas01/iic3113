/**
 * Data Analyzer - Análisis avanzado de datos inmobiliarios
 * Preparado para futura integración con IA
 */

/**
 * Analyze property data and generate insights
 */
export function analyzeData(properties) {
    if (!properties || properties.length === 0) {
        return {
            summary: { totalProperties: 0 },
            message: 'No hay datos para analizar'
        };
    }

    console.log(`📊 Analyzing ${properties.length} properties...`);

    // Filter out properties over 40,000 UF
    const filteredProperties = properties.filter(p => {
        const priceUF = p.priceUF || 0;
        return priceUF <= 40000;
    });

    const excludedCount = properties.length - filteredProperties.length;
    if (excludedCount > 0) {
        console.log(`🔍 Filtered out ${excludedCount} properties over 40,000 UF`);
    }

    console.log(`📊 Analyzing ${filteredProperties.length} properties (after filtering)...`);

    const analysis = {
        summary: getSummaryStats(filteredProperties),
        priceAnalysis: analyzePrices(filteredProperties),
        locationAnalysis: analyzeByLocation(filteredProperties),
        typeAnalysis: analyzeByType(filteredProperties),
        sizeAnalysis: analyzeSize(filteredProperties),
        amenitiesAnalysis: analyzeAmenities(filteredProperties),
        timeAnalysis: analyzeByTime(filteredProperties),
        marketInsights: generateMarketInsights(filteredProperties),
        correlations: analyzeCorrelations(filteredProperties),
        opportunities: findOpportunities(filteredProperties),
        trends: analyzeTrends(filteredProperties),
        aiReadyData: prepareDataForAI(filteredProperties),
        filterInfo: {
            totalScraped: properties.length,
            totalAnalyzed: filteredProperties.length,
            excluded: excludedCount,
            maxPriceUF: 40000
        }
    };

    console.log('✅ Analysis completed');
    return analysis;
}

/**
 * Basic summary statistics
 */
function getSummaryStats(properties) {
    const withPrice = properties.filter(p => p.price && p.price > 0);
    const withArea = properties.filter(p => p.area && p.area > 0);

    return {
        totalProperties: properties.length,
        withPrice: withPrice.length,
        withArea: withArea.length,
        averagePrice: avg(withPrice.map(p => p.price)),
        medianPrice: median(withPrice.map(p => p.price)),
        minPrice: Math.min(...withPrice.map(p => p.price)),
        maxPrice: Math.max(...withPrice.map(p => p.price)),
        averageArea: avg(withArea.map(p => p.area)),
        medianArea: median(withArea.map(p => p.area)),
        dataQuality: calculateDataQuality(properties)
    };
}

/**
 * Analyze prices - now with UF-based distribution
 */
function analyzePrices(properties) {
    const withPrice = properties.filter(p => p.price && p.price > 0);
    const withPriceAndArea = properties.filter(p => p.price > 0 && p.area > 0);
    const withPriceUF = properties.filter(p => p.priceUF && p.priceUF > 0);

    const pricesPerSqMeter = withPriceAndArea.map(p => p.price / p.area);

    // UF-based distribution (2000 UF intervals)
    const ufDistribution = {
        '0-2000': withPriceUF.filter(p => p.priceUF > 0 && p.priceUF <= 2000).length,
        '2000-4000': withPriceUF.filter(p => p.priceUF > 2000 && p.priceUF <= 4000).length,
        '4000-6000': withPriceUF.filter(p => p.priceUF > 4000 && p.priceUF <= 6000).length,
        '6000-8000': withPriceUF.filter(p => p.priceUF > 6000 && p.priceUF <= 8000).length,
        '8000-10000': withPriceUF.filter(p => p.priceUF > 8000 && p.priceUF <= 10000).length,
        '10000-12000': withPriceUF.filter(p => p.priceUF > 10000 && p.priceUF <= 12000).length,
        '12000-14000': withPriceUF.filter(p => p.priceUF > 12000 && p.priceUF <= 14000).length,
        '14000-16000': withPriceUF.filter(p => p.priceUF > 14000 && p.priceUF <= 16000).length,
        '16000-18000': withPriceUF.filter(p => p.priceUF > 16000 && p.priceUF <= 18000).length,
        '18000-20000': withPriceUF.filter(p => p.priceUF > 18000 && p.priceUF <= 20000).length,
        '20000+': withPriceUF.filter(p => p.priceUF > 20000).length
    };

    return {
        distribution: ufDistribution,
        ufStats: {
            average: avg(withPriceUF.map(p => p.priceUF)),
            median: median(withPriceUF.map(p => p.priceUF)),
            min: Math.min(...withPriceUF.map(p => p.priceUF)),
            max: Math.max(...withPriceUF.map(p => p.priceUF)),
            stdDev: stdDev(withPriceUF.map(p => p.priceUF))
        },
        pricePerSqMeter: {
            average: avg(pricesPerSqMeter),
            median: median(pricesPerSqMeter),
            min: Math.min(...pricesPerSqMeter),
            max: Math.max(...pricesPerSqMeter),
            stdDev: stdDev(pricesPerSqMeter)
        },
        pricePerSqMeterUF: withPriceAndArea.length > 0 ? {
            average: avg(withPriceAndArea.map(p => p.priceUF / p.area)),
            median: median(withPriceAndArea.map(p => p.priceUF / p.area)),
            min: Math.min(...withPriceAndArea.map(p => p.priceUF / p.area)),
            max: Math.max(...withPriceAndArea.map(p => p.priceUF / p.area))
        } : null,
        quartiles: calculateQuartiles(withPrice.map(p => p.price)),
        outliers: detectOutliers(withPrice.map(p => p.price))
    };
}

/**
 * Analyze by location (comuna and neighborhoods)
 */
function analyzeByLocation(properties) {
    const byComuna = groupBy(properties, 'comuna');
    
    const comunaStats = {};
    for (const [comuna, props] of Object.entries(byComuna)) {
        const withPrice = props.filter(p => p.price > 0);
        const withArea = props.filter(p => p.area > 0);
        const withPriceUF = props.filter(p => p.priceUF > 0);

        // analyze neighborhoods within comuna
        const neighborhoods = {};
        props.forEach(p => {
            if (p.neighborhood) {
                if (!neighborhoods[p.neighborhood]) {
                    neighborhoods[p.neighborhood] = [];
                }
                neighborhoods[p.neighborhood].push(p);
            }
        });

        const neighborhoodStats = {};
        for (const [neighborhood, nProps] of Object.entries(neighborhoods)) {
            const nWithPrice = nProps.filter(p => p.priceUF > 0);
            const nWithArea = nProps.filter(p => p.area > 0);
            
            neighborhoodStats[neighborhood] = {
                count: nProps.length,
                avgPriceUF: avg(nWithPrice.map(p => p.priceUF)),
                avgArea: avg(nWithArea.map(p => p.area)),
                avgPricePerSqMeterUF: nWithPrice.length > 0 && nWithArea.length > 0
                    ? avg(nProps.filter(p => p.priceUF > 0 && p.area > 0).map(p => p.priceUF / p.area))
                    : null
            };
        }

        comunaStats[comuna] = {
            count: props.length,
            averagePrice: avg(withPrice.map(p => p.price)),
            averagePriceUF: avg(withPriceUF.map(p => p.priceUF)),
            medianPrice: median(withPrice.map(p => p.price)),
            medianPriceUF: median(withPriceUF.map(p => p.priceUF)),
            averageArea: avg(withArea.map(p => p.area)),
            averagePricePerSqMeter: withPrice.length > 0 && withArea.length > 0 
                ? avg(props.filter(p => p.price > 0 && p.area > 0).map(p => p.price / p.area))
                : null,
            averagePricePerSqMeterUF: withPriceUF.length > 0 && withArea.length > 0
                ? avg(props.filter(p => p.priceUF > 0 && p.area > 0).map(p => p.priceUF / p.area))
                : null,
            newListings: props.filter(p => p.isNew).length,
            propertyTypes: countByKey(props, 'propertyType'),
            neighborhoods: neighborhoodStats,
            // price distribution within comuna
            priceRangeUF: {
                '0-5000': withPriceUF.filter(p => p.priceUF <= 5000).length,
                '5000-10000': withPriceUF.filter(p => p.priceUF > 5000 && p.priceUF <= 10000).length,
                '10000-15000': withPriceUF.filter(p => p.priceUF > 10000 && p.priceUF <= 15000).length,
                '15000+': withPriceUF.filter(p => p.priceUF > 15000).length
            }
        };
    }

    // rank neighborhoods across all comunas
    const allNeighborhoods = [];
    for (const [comuna, stats] of Object.entries(comunaStats)) {
        for (const [neighborhood, nStats] of Object.entries(stats.neighborhoods)) {
            allNeighborhoods.push({
                neighborhood,
                comuna,
                ...nStats
            });
        }
    }

    const topNeighborhoods = allNeighborhoods
        .filter(n => n.avgPricePerSqMeterUF)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    // rank by various metrics
    const ranking = {
        mostExpensive: Object.entries(comunaStats)
            .sort((a, b) => (b[1].averagePriceUF || 0) - (a[1].averagePriceUF || 0))
            .slice(0, 5)
            .map(([comuna, stats]) => ({ comuna, ...stats })),
        mostListings: Object.entries(comunaStats)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 5)
            .map(([comuna, stats]) => ({ comuna, ...stats })),
        bestValue: Object.entries(comunaStats)
            .filter(([_, stats]) => stats.averagePricePerSqMeterUF)
            .sort((a, b) => (a[1].averagePricePerSqMeterUF || Infinity) - (b[1].averagePricePerSqMeterUF || Infinity))
            .slice(0, 5)
            .map(([comuna, stats]) => ({ comuna, ...stats }))
    };

    return { 
        byComuna: comunaStats, 
        ranking,
        topNeighborhoods,
        totalNeighborhoods: allNeighborhoods.length
    };
}

/**
 * Analyze by property type
 */
function analyzeByType(properties) {
    const byType = groupBy(properties, 'propertyType');
    
    const typeStats = {};
    for (const [type, props] of Object.entries(byType)) {
        const withPrice = props.filter(p => p.price > 0);

        typeStats[type] = {
            count: props.length,
            percentage: (props.length / properties.length * 100).toFixed(1),
            averagePrice: avg(withPrice.map(p => p.price)),
            medianPrice: median(withPrice.map(p => p.price)),
            priceRange: {
                min: Math.min(...withPrice.map(p => p.price)),
                max: Math.max(...withPrice.map(p => p.price))
            },
            averageBedrooms: avg(props.filter(p => p.bedrooms).map(p => p.bedrooms)),
            averageBathrooms: avg(props.filter(p => p.bathrooms).map(p => p.bathrooms)),
            averageArea: avg(props.filter(p => p.area).map(p => p.area))
        };
    }

    return typeStats;
}

/**
 * Analyze property sizes
 */
function analyzeSize(properties) {
    const withArea = properties.filter(p => p.area && p.area > 0);
    
    return {
        distribution: {
            tiny: withArea.filter(p => p.area < 30).length,
            small: withArea.filter(p => p.area >= 30 && p.area < 60).length,
            medium: withArea.filter(p => p.area >= 60 && p.area < 100).length,
            large: withArea.filter(p => p.area >= 100 && p.area < 200).length,
            xlarge: withArea.filter(p => p.area >= 200 && p.area < 400).length,
            huge: withArea.filter(p => p.area >= 400).length
        },
        average: avg(withArea.map(p => p.area)),
        median: median(withArea.map(p => p.area))
    };
}

/**
 * Analyze amenities (bedrooms, bathrooms, parking, bodegas, features)
 */
function analyzeAmenities(properties) {
    const withParking = properties.filter(p => p.parking && p.parking > 0);
    const withBodegas = properties.filter(p => p.bodegas && p.bodegas > 0);
    
    // analyze parking impact on price
    const parkingImpact = withParking.length > 0 ? {
        withParking: {
            count: withParking.length,
            avgPriceUF: avg(withParking.filter(p => p.priceUF > 0).map(p => p.priceUF)),
            avgParkingSpaces: avg(withParking.map(p => p.parking))
        },
        withoutParking: {
            count: properties.filter(p => !p.parking || p.parking === 0).length,
            avgPriceUF: avg(properties.filter(p => (!p.parking || p.parking === 0) && p.priceUF > 0).map(p => p.priceUF))
        }
    } : null;

    // analyze bodegas impact
    const bodegasImpact = withBodegas.length > 0 ? {
        withBodegas: {
            count: withBodegas.length,
            avgPriceUF: avg(withBodegas.filter(p => p.priceUF > 0).map(p => p.priceUF)),
            avgBodegas: avg(withBodegas.map(p => p.bodegas))
        },
        withoutBodegas: {
            count: properties.filter(p => !p.bodegas || p.bodegas === 0).length,
            avgPriceUF: avg(properties.filter(p => (!p.bodegas || p.bodegas === 0) && p.priceUF > 0).map(p => p.priceUF))
        }
    } : null;

    // analyze property features/amenities
    const featureAnalysis = {};
    if (properties.some(p => p.amenities)) {
        const features = ['gimnasio', 'piscina', 'terraza', 'seguridad', 'amoblado', 'logia', 'vista', 'luminoso'];
        
        features.forEach(feature => {
            const withFeature = properties.filter(p => p.amenities && p.amenities[feature]);
            const withFeatureAndPrice = withFeature.filter(p => p.priceUF > 0);
            
            if (withFeature.length > 0) {
                featureAnalysis[feature] = {
                    count: withFeature.length,
                    percentage: ((withFeature.length / properties.length) * 100).toFixed(1),
                    avgPriceUF: withFeatureAndPrice.length > 0 ? avg(withFeatureAndPrice.map(p => p.priceUF)) : null
                };
            }
        });
    }

    return {
        bedrooms: countByKey(properties.filter(p => p.bedrooms), 'bedrooms'),
        bathrooms: countByKey(properties.filter(p => p.bathrooms), 'bathrooms'),
        parking: countByKey(properties.filter(p => p.parking), 'parking'),
        bodegas: countByKey(properties.filter(p => p.bodegas), 'bodegas'),
        averages: {
            bedrooms: avg(properties.filter(p => p.bedrooms).map(p => p.bedrooms)),
            bathrooms: avg(properties.filter(p => p.bathrooms).map(p => p.bathrooms)),
            parking: avg(properties.filter(p => p.parking).map(p => p.parking)),
            bodegas: avg(properties.filter(p => p.bodegas).map(p => p.bodegas))
        },
        parkingImpact,
        bodegasImpact,
        features: featureAnalysis,
        // most valuable combination
        valuableCombinations: analyzeValueCombinations(properties)
    };
}

/**
 * Analyze which combinations of features provide best value
 */
function analyzeValueCombinations(properties) {
    const combos = [];
    
    // bedrooms + bathrooms combinations
    properties.forEach(p => {
        if (p.bedrooms && p.bathrooms && p.priceUF > 0 && p.area > 0) {
            const combo = `${p.bedrooms}D/${p.bathrooms}B`;
            const existing = combos.find(c => c.combo === combo);
            
            if (existing) {
                existing.prices.push(p.priceUF);
                existing.areas.push(p.area);
                existing.count++;
            } else {
                combos.push({
                    combo,
                    prices: [p.priceUF],
                    areas: [p.area],
                    count: 1
                });
            }
        }
    });
    
    return combos
        .filter(c => c.count >= 3) // at least 3 properties
        .map(c => ({
            combo: c.combo,
            count: c.count,
            avgPriceUF: avg(c.prices),
            avgArea: avg(c.areas),
            avgPricePerSqMeterUF: avg(c.prices) / avg(c.areas)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
}

/**
 * Analyze by time (scraping timestamps)
 */
function analyzeByTime(properties) {
    const withTimestamp = properties.filter(p => p.scrapedAt);
    const newProperties = properties.filter(p => p.isNew);

    return {
        totalScraped: withTimestamp.length,
        newListings: newProperties.length,
        newListingsPercentage: ((newProperties.length / properties.length) * 100).toFixed(1),
        oldestEntry: withTimestamp.length > 0 ? Math.min(...withTimestamp.map(p => new Date(p.scrapedAt).getTime())) : null,
        newestEntry: withTimestamp.length > 0 ? Math.max(...withTimestamp.map(p => new Date(p.scrapedAt).getTime())) : null
    };
}

/**
 * Generate market insights
 */
function generateMarketInsights(properties) {
    const insights = [];

    const withPrice = properties.filter(p => p.price > 0);
    const avgPrice = avg(withPrice.map(p => p.price));

    // Insight 1: Hot zones
    const byComuna = groupBy(properties, 'comuna');
    const hotZone = Object.entries(byComuna)
        .sort((a, b) => b[1].length - a[1].length)[0];
    
    if (hotZone) {
        insights.push({
            type: 'hot_zone',
            title: 'Zona con Mayor Oferta',
            description: `${hotZone[0]} tiene la mayor cantidad de propiedades disponibles (${hotZone[1].length} propiedades)`,
            comuna: hotZone[0],
            count: hotZone[1].length
        });
    }

    // Insight 2: Best value
    const propsWithPriceAndArea = properties.filter(p => p.price > 0 && p.area > 0);
    if (propsWithPriceAndArea.length > 0) {
        const bestValue = propsWithPriceAndArea.reduce((best, prop) => {
            const currentPricePerSqM = prop.price / prop.area;
            const bestPricePerSqM = best.price / best.area;
            return currentPricePerSqM < bestPricePerSqM ? prop : best;
        });

        insights.push({
            type: 'best_value',
            title: 'Mejor Relación Precio/m²',
            description: `La mejor oportunidad está en ${bestValue.comuna} con ${(bestValue.price / bestValue.area).toFixed(0)} pesos por m²`,
            property: bestValue
        });
    }

    // Insight 3: Average market price
    insights.push({
        type: 'average_market',
        title: 'Precio Promedio del Mercado',
        description: `El precio promedio actual es de ${formatPrice(avgPrice)}`,
        value: avgPrice
    });

    // Insight 4: New listings trend
    const newListings = properties.filter(p => p.isNew);
    if (newListings.length > 0) {
        insights.push({
            type: 'new_listings',
            title: 'Nuevas Propiedades',
            description: `${newListings.length} propiedades nuevas han sido publicadas recientemente (${((newListings.length / properties.length) * 100).toFixed(1)}% del total)`,
            count: newListings.length,
            percentage: ((newListings.length / properties.length) * 100).toFixed(1)
        });
    }

    return insights;
}

/**
 * Analyze correlations between variables
 */
function analyzeCorrelations(properties) {
    const propsWithData = properties.filter(p => p.price > 0 && p.area > 0);

    return {
        priceVsArea: calculateCorrelation(
            propsWithData.map(p => p.area),
            propsWithData.map(p => p.price)
        ),
        priceVsBedrooms: calculateCorrelation(
            propsWithData.filter(p => p.bedrooms).map(p => p.bedrooms),
            propsWithData.filter(p => p.bedrooms).map(p => p.price)
        ),
        priceVsBathrooms: calculateCorrelation(
            propsWithData.filter(p => p.bathrooms).map(p => p.bathrooms),
            propsWithData.filter(p => p.bathrooms).map(p => p.price)
        )
    };
}

/**
 * Find investment opportunities
 */
function findOpportunities(properties) {
    // Use priceUF for calculations
    const withPriceAndArea = properties.filter(p => p.priceUF > 0 && p.area > 0);
    
    if (withPriceAndArea.length === 0) return [];

    const avgPricePerSqM = avg(withPriceAndArea.map(p => p.priceUF / p.area));
    const stdDevPricePerSqM = stdDev(withPriceAndArea.map(p => p.priceUF / p.area));

    // Find properties below average price per sq meter
    const opportunities = withPriceAndArea
        .map(p => ({
            ...p,
            pricePerSqM: p.priceUF / p.area,
            savingsPerSqM: avgPricePerSqM - (p.priceUF / p.area),
            score: (avgPricePerSqM - (p.priceUF / p.area)) / stdDevPricePerSqM
        }))
        .filter(p => p.savingsPerSqM > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

    return opportunities.map(o => ({
        property: {
            id: o.id,
            title: o.title,
            comuna: o.comuna,
            price: o.priceUF, // Use priceUF instead of price
            area: o.area,
            bedrooms: o.bedrooms || 0,
            bathrooms: o.bathrooms || 0,
            parking: o.parking || o.parkings || 0,
            bodegas: o.bodegas || 0,
            amenities: o.amenities || {},
            yearBuilt: o.yearBuilt || o.specs?.['año de construcción'] || null,
            orientation: o.orientation || o.specs?.['orientación'] || o.specs?.['orientacion'] || null,
            link: o.link || null
        },
        pricePerSqM: Math.round(o.pricePerSqM),
        marketAverage: Math.round(avgPricePerSqM),
        savings: Math.round(o.savingsPerSqM),
        score: o.score.toFixed(2),
        recommendation: o.score > 1 ? 'Excelente oportunidad' : 'Buena oportunidad'
    }));
}

/**
 * Analyze market trends
 */
function analyzeTrends(properties) {
    const byOperation = groupBy(properties, 'operation');
    
    return {
        operationType: {
            venta: byOperation.venta?.length || 0,
            arriendo: byOperation.arriendo?.length || 0
        },
        marketActivity: properties.filter(p => p.isNew).length > properties.length * 0.2 ? 'high' : 'moderate',
        priceVariability: stdDev(properties.filter(p => p.price > 0).map(p => p.price)) > 50000000 ? 'high' : 'moderate'
    };
}

/**
 * Prepare data structure for AI integration
 */
function prepareDataForAI(properties) {
    return {
        dataSchema: {
            fields: [
                'id', 'title', 'price', 'priceUF', 'currency', 'location', 'comuna',
                'propertyType', 'operation', 'bedrooms', 'bathrooms', 'area', 'parking',
                'isNew', 'realEstate', 'scrapedAt', 'source'
            ],
            numericFields: ['price', 'priceUF', 'bedrooms', 'bathrooms', 'area', 'parking'],
            categoricalFields: ['comuna', 'propertyType', 'operation', 'currency', 'realEstate'],
            temporalFields: ['scrapedAt']
        },
        summary: {
            totalRecords: properties.length,
            completeness: calculateDataQuality(properties),
            readyForML: properties.length >= 100 && calculateDataQuality(properties) > 0.7
        },
        suggestedModels: [
            {
                name: 'Price Prediction',
                type: 'Regression',
                features: ['comuna', 'propertyType', 'bedrooms', 'bathrooms', 'area', 'parking'],
                target: 'price',
                description: 'Predice el precio de una propiedad basado en sus características'
            },
            {
                name: 'Property Classification',
                type: 'Classification',
                features: ['price', 'area', 'bedrooms', 'bathrooms'],
                target: 'propertyType',
                description: 'Clasifica el tipo de propiedad basado en características'
            },
            {
                name: 'Opportunity Detection',
                type: 'Anomaly Detection',
                features: ['price', 'area', 'pricePerSqM'],
                description: 'Detecta propiedades con precios anormalmente bajos (oportunidades)'
            },
            {
                name: 'Market Segmentation',
                type: 'Clustering',
                features: ['price', 'area', 'comuna', 'bedrooms'],
                description: 'Agrupa propiedades similares en segmentos de mercado'
            }
        ],
        dataQualityReport: {
            missingValues: countMissingValues(properties),
            dataTypes: validateDataTypes(properties),
            outliers: detectAllOutliers(properties)
        }
    };
}

// ============= Helper Functions =============

function avg(arr) {
    if (!arr || arr.length === 0) return 0;
    const filtered = arr.filter(x => x != null && !isNaN(x));
    return filtered.length > 0 ? filtered.reduce((a, b) => a + b, 0) / filtered.length : 0;
}

function median(arr) {
    if (!arr || arr.length === 0) return 0;
    const filtered = arr.filter(x => x != null && !isNaN(x)).sort((a, b) => a - b);
    const mid = Math.floor(filtered.length / 2);
    return filtered.length % 2 === 0 ? (filtered[mid - 1] + filtered[mid]) / 2 : filtered[mid];
}

function stdDev(arr) {
    if (!arr || arr.length === 0) return 0;
    const filtered = arr.filter(x => x != null && !isNaN(x));
    const average = avg(filtered);
    const squareDiffs = filtered.map(value => Math.pow(value - average, 2));
    return Math.sqrt(avg(squareDiffs));
}

function groupBy(arr, key) {
    return arr.reduce((groups, item) => {
        const group = item[key] || 'unknown';
        groups[group] = groups[group] || [];
        groups[group].push(item);
        return groups;
    }, {});
}

function countByKey(arr, key) {
    return arr.reduce((counts, item) => {
        const value = item[key];
        counts[value] = (counts[value] || 0) + 1;
        return counts;
    }, {});
}

function calculateQuartiles(arr) {
    if (!arr || arr.length === 0) return { q1: 0, q2: 0, q3: 0 };
    const sorted = arr.filter(x => x != null).sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q2 = sorted[Math.floor(sorted.length * 0.5)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    return { q1, q2, q3 };
}

function detectOutliers(arr) {
    if (!arr || arr.length === 0) return { count: 0, values: [] };
    const { q1, q3 } = calculateQuartiles(arr);
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    const outliers = arr.filter(x => x < lowerBound || x > upperBound);
    return { count: outliers.length, lowerBound, upperBound };
}

function calculateCorrelation(x, y) {
    if (!x || !y || x.length !== y.length || x.length === 0) return 0;
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
}

function calculateDataQuality(properties) {
    if (properties.length === 0) return 0;
    const importantFields = ['price', 'comuna', 'propertyType', 'area'];
    const completeness = properties.map(p => {
        const presentFields = importantFields.filter(field => p[field] != null && p[field] !== '').length;
        return presentFields / importantFields.length;
    });
    return avg(completeness);
}

function countMissingValues(properties) {
    const fields = ['price', 'area', 'bedrooms', 'bathrooms', 'parking', 'comuna', 'propertyType'];
    const missing = {};
    
    fields.forEach(field => {
        missing[field] = properties.filter(p => !p[field] || p[field] === null).length;
    });
    
    return missing;
}

function validateDataTypes(properties) {
    return {
        priceNumeric: properties.filter(p => typeof p.price === 'number').length,
        areaNumeric: properties.filter(p => typeof p.area === 'number').length,
        comunaString: properties.filter(p => typeof p.comuna === 'string').length
    };
}

function detectAllOutliers(properties) {
    return {
        price: detectOutliers(properties.filter(p => p.price).map(p => p.price)),
        area: detectOutliers(properties.filter(p => p.area).map(p => p.area))
    };
}

function formatPrice(price) {
    if (price >= 1000000) {
        return `$${(price / 1000000).toFixed(1)}M`;
    }
    return `$${price.toLocaleString('es-CL')}`;
}

export default {
    analyzeData,
    getSummaryStats,
    analyzePrices,
    analyzeByLocation,
    analyzeByType,
    generateMarketInsights,
    findOpportunities,
    prepareDataForAI
};

