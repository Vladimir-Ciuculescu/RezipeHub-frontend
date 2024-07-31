import {
  Text,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import RNIcon from "@/components/shared/RNIcon";
import { $sizeStyles } from "@/theme/typography";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import useRecipeStore from "@/zustand/useRecipeStore";
import { spacing } from "@/theme/spacing";
import { View } from "react-native-ui-lib";
import RNSegmentedControl, { SegmentItem } from "@/components/shared/RnSegmentedControl";
import IngredientsList from "@/components/IngredientsList";
import StepsList from "@/components/StepsList";
import { IngredientItem } from "@/types/ingredient";
import RecipeService from "@/api/services/recipe.service";
import useUserData from "@/hooks/useUserData";
import S3Service from "@/api/services/s3.service";
import { AddRecipeRequest } from "@/types/recipe.types";
import Entypo from "@expo/vector-icons/Entypo";

const { height, width } = Dimensions.get("screen");

const HEADER_HEIGHT = height / 4;
const SEGMENTS: SegmentItem[] = [{ label: "Ingredients" }, { label: "Instructions" }];

export default function RecipeSubmit() {
  const navigation = useNavigation();
  const router = useRouter();
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputsFlatlListRef = useRef<FlatList>(null);
  const user = useUserData();

  const title = useRecipeStore.use.title();
  const servings = useRecipeStore.use.servings();
  const photo = useRecipeStore.use.photo();
  const ingredients = useRecipeStore.use.ingredients();
  const steps = useRecipeStore.use.steps();
  const reset = useRecipeStore.use.reset();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={goBack}
          disabled={loading}
          style={loading ? styles.$disabledBackBtnStyle : styles.$enabledBackBtnStyle}
        >
          <RNIcon name="arrow_left" />
        </Pressable>
      ),
      headerRight: () =>
        loading ? (
          <ActivityIndicator color={colors.accent200} />
        ) : (
          <TouchableOpacity onPress={addRecipe}>
            <RNIcon
              name="bowl"
              color={colors.accent200}
            />
          </TouchableOpacity>
        ),
      headerTitle: () => <Text style={[$sizeStyles.h3]}>Confirm recipe</Text>,
    });
  }, [navigation, user, loading]);

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  const addRecipe = async () => {
    setLoading(true);

    const ingredientsPayload = ingredients.map((ingredient) => {
      return {
        name: ingredient.title,
        unit: ingredient.measure,
        quantity: parseInt(ingredient.quantity),
        calories: ingredient.calories!,
        carbs: ingredient.carbs!,
        proteins: ingredient.proteins!,
        fats: ingredient.fats!,
      };
    });

    const stepsPayload = steps.map((step) => ({
      text: step.description,
      step: step.number,
    }));

    const payload: AddRecipeRequest = {
      userId: user!.id,
      title: title,
      servings: servings,
      ingredients: ingredientsPayload,
      steps: stepsPayload,
    };

    try {
      if (photo) {
        const formData = new FormData();

        formData.append("file", {
          uri: photo,
          type: "image/jpeg",
          name: `${user?.id}-${user?.firstName}-${user?.lastName}-${title}`,
        } as any);

        const { url } = await S3Service.uploadImage(formData);

        payload.photoUrl = url;
      }
      await RecipeService.addRecipe(payload);

      reset();
      router.dismissAll();
      router.back();
    } catch (error) {
      //TODO: Handle error with a pop up
      console.log(error);
    }

    setLoading(false);
  };

  const goBack = () => {
    router.back();
  };

  interface NutritionalItemProps {
    icon: React.JSX.Element;
    quantity: number;
    unitMeasure: string;
    type: string;
  }

  const NutritionalItem: React.FC<NutritionalItemProps> = ({
    icon,
    quantity,
    unitMeasure,
    type,
  }) => {
    return (
      <View
        row
        style={styles.$nutritionalItemContainerStyle}
      >
        <View style={styles.$nutritionalItemIconStyle}>{icon}</View>
        <Text style={[$sizeStyles.l, { fontFamily: "sofia400" }]}>
          {quantity}
          {unitMeasure} {type}
        </Text>
      </View>
    );
  };

  const sections = [
    {
      section: <IngredientsList ingredients={ingredients} />,
    },
    {
      section: <StepsList steps={steps} />,
    },
  ];

  const handleSegmentIndex = (index: number) => {
    inputsFlatlListRef.current!.scrollToIndex({ index: index, animated: true });
    setSegmentIndex(index);
  };

  const renderItem: ListRenderItem<any> = ({ item }) => {
    return <View style={{ width }}>{item.section}</View>;
  };

  const calculateTotal = (
    ingredients: IngredientItem[],
    property: keyof Omit<IngredientItem, "foodId" | "measure" | "quantity" | "title">,
  ): number => {
    return ingredients.reduce((sum, ingredient) => sum + (ingredient[property] || 0), 0);
  };

  const totalProteins = Math.floor(calculateTotal(ingredients, "proteins"));
  const totalCarbs = Math.floor(calculateTotal(ingredients, "carbs"));
  const totalCalories = Math.floor(calculateTotal(ingredients, "calories"));
  const totalFats = Math.floor(calculateTotal(ingredients, "fats"));

  return (
    <Animated.ScrollView
      contentContainerStyle={styles.$containerStyle}
      showsVerticalScrollIndicator={false}
      ref={scrollRef}
      scrollEventThrottle={16}
    >
      <View style={styles.$headerContainerStyle}>
        <Animated.View style={[styles.$headerStyle, headerAnimatedStyle]}>
          {photo ? (
            <Image
              source={{
                uri: photo,
              }}
              style={styles.$imageContainerstyle}
            />
          ) : (
            <Entypo
              name="camera"
              size={40}
              color={colors.greyscale150}
            />
          )}
        </Animated.View>
      </View>
      <View style={styles.$contentStyle}>
        <View
          style={{
            paddingHorizontal: spacing.spacing24,
            gap: spacing.spacing24,
          }}
        >
          <Text style={[$sizeStyles.h3]}>{title}</Text>

          <View
            row
            style={{ justifyContent: "space-between" }}
          >
            <View style={{ gap: spacing.spacing16 }}>
              <NutritionalItem
                type="carbs"
                quantity={totalCarbs}
                unitMeasure="g"
                icon={<RNIcon name="carbs" />}
              />
              <NutritionalItem
                type="calories"
                quantity={totalCalories}
                unitMeasure="K"
                icon={<RNIcon name="calories" />}
              />
            </View>
            <View style={{ gap: spacing.spacing16 }}>
              <NutritionalItem
                type="proteins"
                quantity={totalProteins}
                unitMeasure="g"
                icon={<RNIcon name="proteins" />}
              />

              <NutritionalItem
                type="fats"
                quantity={totalFats}
                unitMeasure="g"
                icon={<RNIcon name="fats" />}
              />
            </View>
          </View>

          <RNSegmentedControl
            segments={SEGMENTS}
            initialIndex={segmentIndex}
            //@ts-ignore
            onChangeIndex={handleSegmentIndex}
          />
        </View>

        <FlatList
          scrollEnabled={false}
          ref={inputsFlatlListRef}
          data={sections}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  $containerStyle: {
    paddingBottom: 50,
  },
  $headerContainerStyle: {
    height: HEADER_HEIGHT,
    position: "relative",
  },
  $headerStyle: {
    height: HEADER_HEIGHT,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.greyscale300,
  },

  scrollView: {
    flex: 1,
  },

  $disabledBackBtnStyle: {
    opacity: 0.5,
  },

  $enabledBackBtnStyle: {
    opacity: 1,
  },

  scrollContent: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontSize: 20,
    color: "#333333",
  },

  $contentStyle: {
    flex: 1,
    paddingTop: spacing.spacing16,
    gap: spacing.spacing24,
    backgroundColor: "white",
    overflow: "hidden",
  },
  $titleContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  $stepContainerStyle: {
    gap: 8,
    marginBottom: 8,
  },

  $imageContainerstyle: {
    width: "100%",
    height: "100%",
  },

  $nutritionalItemContainerStyle: { alignItems: "center", gap: spacing.spacing8 },

  $nutritionalItemIconStyle: {
    width: 40,
    height: 40,
    borderRadius: spacing.spacing8,
    backgroundColor: colors.greyscale150,
    alignItems: "center",
    justifyContent: "center",
  },
});
