import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors, Typography, Layout, PlantStages } from '../constants/theme';
import { GardenLand } from '../types';

interface GardenStageProps {
  lands: GardenLand[];
  selectedLandIndex: number | null;
  onSelectLand: (land: GardenLand) => void;
  onHarvest: (land: GardenLand) => void;
  onWater: (land: GardenLand) => void;
  onDisinfest: (land: GardenLand) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PLOT_WIDTH = (SCREEN_WIDTH - 48) / 3;

export const GardenStage: React.FC<GardenStageProps> = ({
  lands,
  selectedLandIndex,
  onSelectLand,
  onHarvest,
  onWater,
  onDisinfest,
}) => {
  const getSoilBackground = (level: number, status: string) => {
    if (status === 'LOCKED') return '#D9D9D9';
    if (level === 3) return '#FFF1B8'; // 金土地
    if (level === 2) return '#D3AD8B'; // 黑红肥沃土地
    return '#E6C29D'; // 普通红土地
  };

  const getMoistureBadge = (val: number) => {
    if (val >= 70) return { label: '水源充足', color: '#52C41A', icon: '💧' };
    if (val >= 40) return { label: '水源流失', color: '#FAAD14', icon: '⚠️' };
    return { label: '水源不足', color: '#FF4D4F', icon: '🚨' };
  };

  return (
    <View style={styles.container}>
      {/* 农场顶部环境状态条 */}
      <View style={styles.skyBar}>
        <View style={styles.skyItem}>
          <Text style={styles.skyIcon}>☀️</Text>
          <Text style={styles.skyText}>阳光充沛 +15%</Text>
        </View>
        <View style={styles.skyItem}>
          <Text style={styles.skyIcon}>🌈</Text>
          <Text style={styles.skyText}>生态等级 Lv.5</Text>
        </View>
        <View style={styles.skyItem}>
          <Text style={styles.skyIcon}>🐝</Text>
          <Text style={styles.skyText}>蜜蜂采蜜中</Text>
        </View>
      </View>

      {/* 2.5D 果园地块网格 (3列 x 4行 = 12块地) */}
      <View style={styles.gridContainer}>
        {lands.map((land) => {
          const isSelected = selectedLandIndex === land.landIndex;
          const soilBg = getSoilBackground(land.landLevel, land.status);
          const moisture = getMoistureBadge(land.moistureVal);

          return (
            <TouchableOpacity
              key={land.landIndex}
              activeOpacity={0.8}
              onPress={() => onSelectLand(land)}
              style={[
                styles.plotCard,
                { backgroundColor: soilBg },
                isSelected && styles.plotSelected,
                land.hasPest && styles.plotPestInfested,
              ]}
            >
              {/* 地块序号与等级角标 */}
              <View style={styles.plotHeader}>
                <Text style={styles.plotIndex}>#{land.landIndex}</Text>
                {land.status !== 'LOCKED' && (
                  <Text style={styles.landLevelBadge}>
                    {land.landLevel === 3 ? '金土' : land.landLevel === 2 ? '肥土' : '普土'}
                  </Text>
                )}
              </View>

              {/* 地块中间植物/状态展示 */}
              <View style={styles.plantArea}>
                {land.status === 'LOCKED' ? (
                  <View style={styles.lockedCenter}>
                    <Text style={styles.lockedIcon}>🔒</Text>
                    <Text style={styles.lockedText}>待开垦</Text>
                  </View>
                ) : land.status === 'EMPTY' ? (
                  <View style={styles.emptyCenter}>
                    <Text style={styles.emptyIcon}>🪴</Text>
                    <Text style={styles.emptyText}>空闲土地</Text>
                    <Text style={styles.tapPlantHint}>+ 点击播种</Text>
                  </View>
                ) : (
                  <View style={styles.growingCenter}>
                    {/* 害虫爬动/生虫状态 */}
                    {land.hasPest && (
                      <View style={styles.pestOverlay}>
                        <Text style={styles.pestBugs}>🐛 🐛</Text>
                        <View style={styles.pestWarningTag}>
                          <Text style={styles.pestWarningText}>遭遇害虫!</Text>
                        </View>
                      </View>
                    )}

                    {/* 植物阶段与 Emoji */}
                    <Text style={styles.plantEmoji}>
                      {land.status === 'MATURE'
                        ? '🌹'
                        : PlantStages.find((s) => s.stage === land.currentStage)?.emoji || '🌱'}
                    </Text>

                    <Text style={styles.plantName} numberOfLines={1}>
                      {land.plantName || '鲜花'}
                    </Text>

                    {/* 成熟采摘闪烁光标 */}
                    {land.status === 'MATURE' ? (
                      <TouchableOpacity
                        style={styles.harvestQuickBtn}
                        onPress={() => onHarvest(land)}
                      >
                        <Text style={styles.harvestQuickText}>✨ 采摘 +{land.estimatedYield || 6}</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.stageProgressBar}>
                        <View
                          style={[
                            styles.stageProgressFill,
                            { width: `${(land.currentStage / 5) * 100}%` },
                          ]}
                        />
                      </View>
                    )}
                  </View>
                )}
              </View>

              {/* 底部水分与状态条 */}
              {land.status !== 'LOCKED' && land.status !== 'EMPTY' && (
                <View style={styles.plotFooter}>
                  <Text style={[styles.moistureLabel, { color: moisture.color }]}>
                    {moisture.icon} {land.moistureVal}%
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#C8E6C9',
    borderRadius: Layout.radius.lg,
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: '#A5D6A7',
    ...Layout.shadow.card,
  },
  skyBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Layout.radius.full,
    marginBottom: 12,
  },
  skyItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skyIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  skyText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  plotCard: {
    width: PLOT_WIDTH,
    height: 115,
    borderRadius: Layout.radius.md,
    marginBottom: 10,
    padding: 6,
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#BCAAA4',
    ...Layout.shadow.card,
  },
  plotSelected: {
    borderColor: Colors.rose,
    borderWidth: 2.5,
    transform: [{ scale: 1.03 }],
  },
  plotPestInfested: {
    borderColor: Colors.danger,
    borderWidth: 2,
    backgroundColor: '#FFEBEE',
  },
  plotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plotIndex: {
    fontSize: 10,
    color: '#5D4037',
    fontWeight: 'bold',
  },
  landLevelBadge: {
    fontSize: 9,
    backgroundColor: 'rgba(0,0,0,0.1)',
    color: '#3E2723',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 3,
  },
  plantArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedCenter: {
    alignItems: 'center',
  },
  lockedIcon: {
    fontSize: 22,
    color: '#888',
  },
  lockedText: {
    fontSize: 11,
    color: '#777',
    marginTop: 2,
  },
  emptyCenter: {
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 20,
    opacity: 0.6,
  },
  emptyText: {
    fontSize: 10,
    color: '#6D4C41',
  },
  tapPlantHint: {
    fontSize: 10,
    color: Colors.primaryDark,
    fontWeight: 'bold',
    marginTop: 2,
  },
  growingCenter: {
    alignItems: 'center',
    width: '100%',
  },
  pestOverlay: {
    position: 'absolute',
    top: -6,
    alignItems: 'center',
    zIndex: 10,
  },
  pestBugs: {
    fontSize: 14,
  },
  pestWarningTag: {
    backgroundColor: Colors.danger,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  pestWarningText: {
    color: Colors.white,
    fontSize: 8,
    fontWeight: 'bold',
  },
  plantEmoji: {
    fontSize: 26,
  },
  plantName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3E2723',
    marginTop: 2,
  },
  stageProgressBar: {
    width: '80%',
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  stageProgressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  harvestQuickBtn: {
    backgroundColor: Colors.rose,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Layout.radius.full,
    marginTop: 2,
  },
  harvestQuickText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  plotFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moistureLabel: {
    fontSize: 9,
    fontWeight: 'bold',
  },
});
