import React, { forwardRef, useCallback, useMemo } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

type Ref = BottomSheetModal;

interface Props {
  children: React.ReactNode;
  onDismiss: () => void;
}

const FiltersBottomSheet = forwardRef<Ref, Props>((props, ref) => {
  const snapPoints = useMemo(() => ["85%", "85%"], []);

  const { children, onDismiss } = props;

  const renderBackDrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      onDismiss={onDismiss}
      backdropComponent={renderBackDrop}
      index={0}
      handleIndicatorStyle={{ backgroundColor: colors.greyscale300, width: 50, height: 5 }}
      backgroundStyle={{ borderRadius: spacing.spacing24 }}
      snapPoints={snapPoints}
      ref={ref}
    >
      <BottomSheetScrollView
        contentContainerStyle={{
          paddingBottom: spacing.spacing32,
        }}
        style={{ flex: 1, height: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

export default FiltersBottomSheet;
