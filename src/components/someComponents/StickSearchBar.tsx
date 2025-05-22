import React, {FC} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import SearchBar from '../../components/addedCompnents/SearchBar';
import {goBack} from '../../utils/NavigationUtils';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../utils/Constants';

interface StickSearchBarProps {
  search: string;
  onSearchChange: (text: string) => void;
  onFilter: () => void;
}

const StickSearchBar: FC<StickSearchBarProps> = ({
  search,
  onSearchChange,
  onFilter,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={goBack}>
          <Icon name="arrow-back" size={24} color={Colors.black} />
        </TouchableOpacity>
      </View>
      <SearchBar
        value={search}
        onChangeText={onSearchChange}
        onFilter={onFilter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center', // vertical align
    paddingHorizontal: 8,
  },
  backButtonContainer: {
    height: 40, // Adjust to match SearchBar height if needed
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
});

export default StickSearchBar;