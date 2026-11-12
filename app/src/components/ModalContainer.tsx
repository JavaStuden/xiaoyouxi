import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { Colors, Typography, Layout } from '../constants/theme';

interface ModalContainerProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  height?: number | string;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const ModalContainer: React.FC<ModalContainerProps> = ({
  visible,
  onClose,
  title,
  children,
  height = '70%',
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={[styles.sheet, { height: typeof height === 'number' ? height : (SCREEN_HEIGHT * 0.75) }]}>
              {/* 顶部指示条 */}
              <View style={styles.indicatorContainer}>
                <View style={styles.indicator} />
              </View>

              {/* 标题栏 */}
              <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* 内容区域 */}
              <View style={styles.content}>
                {children}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Layout.radius.xl,
    borderTopRightRadius: Layout.radius.xl,
    paddingHorizontal: 16,
    paddingBottom: 24,
    ...Layout.shadow.hover,
  },
  indicatorContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  indicator: {
    width: 36,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.divider,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    fontSize: 16,
    color: Colors.textTertiary,
  },
  content: {
    flex: 1,
    marginTop: 8,
  },
});
