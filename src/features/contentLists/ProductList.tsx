import React, {FC, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import CustomText from '../../components/ui/Customtext';
import StickSearchBar from '../../components/someComponents/StickSearchBar';

import {Colors, Fonts} from '../../utils/Constants';
import {NoticeHeight, screenHeight, screenWidth} from '../../utils/Scaling';
import {useAuthStore} from '../../state/authStore';
import useStateList from './product/hooks/useStateList';
import useProductList from './product/hooks/useProductList';
import {pick, types, FilePickerResponse} from '@react-native-documents/picker';
import {goBack, navigate} from '../../utils/NavigationUtils';
import Toast from 'react-native-toast-message';
import useUploadExcelMutation from './product/hooks/useUploadExcelMutation';
import {appAxios} from '../../service/apiInterCepters';
import RNFS from 'react-native-fs';
import FilterProduct from './product/FilterProduct';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as Progress from 'react-native-progress';
import DropDownPicker from 'react-native-dropdown-picker';
import Products from './product/Products';
import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/Ionicons';

interface FileUpload {
  id: string;
  name: string;
  size: string;
  progress: number;
  speed: string;
  status: 'uploading' | 'completed';
}

const ProductList: FC = () => {
  const {authUser, setAuthState, authstate} = useAuthStore();

  const [statusOpen, setStatusOpen] = useState(false);
  const [state, setStates] = useState(authstate || '');

  const [selectedState, setSelectedState] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const skip = (currentPage - 1) * limit;
  const [filter, setFilter] = useState(false);
  const [pack, setPack] = useState('');
  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [file, setSelectedFile] = useState<any>(null);
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const {
    data: stateData,
    isLoading: isStateLoading,
    isError: isStateError,
    refetch: refetchStateList,
    isFetching: isStateFetching,
  } = useStateList();

  const {
    data: productsData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useProductList(search, currentPage, limit, pack, brand, name, state);

  useEffect(() => {
    if (state) {
      setAuthState(state);
      refetch();
    }
  }, [state]);

  const handleAddProduct = () => {
    navigate('AddProduct');
  };

  const handleNextPage = () => {
    if (currentPage < productsData?.pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearch(text);
    setCurrentPage(1);
  };

  const handleFilter = (_brand: string, _pack: string, _name: string) => {
    setPack(_pack);
    setBrand(_brand);
    setName(_name);
    setCurrentPage(1);
    setSearch('');
    refetch();
    Keyboard.dismiss();
  };

  const handleFilePick = async () => {
    try {
      const res: FilePickerResponse[] = await pick({
        type: [types.allFiles],
        allowMultiSelection: false,
      });

      const file = res[0];
      if (file.name && file.name.endsWith('.xlsx')) {
        setSelectedFile({
          name: file.name,
          size: file.size,
          uri: file.uri,
          type: file.type,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Invalid File , Please select a .xlsx Excel file.',
          visibilityTime: 3000,
        });
      }
    } catch (err: any) {
      if (err.code === 'DOCUMENT_PICKER_CANCELED') {
        console.log('User cancelled the picker');
      } else {
        console.log('Unknown error:', err);
      }
    }
  };

  const successHandler = () => {
    Toast.show({
      type: 'success',
      text1: `Document has been Uploaded successfully!`,
      visibilityTime: 6000,
    });
  };

  const errorHandler = (error: any) => {
    Toast.show({
      type: 'error',
      text1: 'Failed to Upload',
      text2: error?.message || 'Something went wrong. Try again.',
      visibilityTime: 3000,
    });
  };

  const uploadDocumentMutation = useUploadExcelMutation(
    successHandler,
    errorHandler,
    progress => setUploadProgress(progress),
  );

  const handleUpload = async () => {
    if (!file) {
      Toast.show({
        type: 'error',
        text1: 'Please select a file to upload!',
        visibilityTime: 3000,
      });
      return;
    }

    const maxFileSize = 5 * 1024 * 1024;
    if (file.size > maxFileSize) {
      Toast.show({
        type: 'error',
        text1: 'File size exceeds 5MB limit!',
        visibilityTime: 4000,
      });
      return;
    }

    const form = new FormData();
    form.append('file', {
      uri: file.uri,
      name: file.name,
      type:
        file.type ||
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    uploadDocumentMutation.reset();
    try {
      await uploadDocumentMutation.mutateAsync(form);
    } catch (error) {
      console.error('File upload failed!', error);
    }
  };

  function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return global.btoa(binary);
  }

  const handleDownloadExcel = async () => {
    try {
      if (!authstate) {
        Toast.show({type: 'error', text1: 'State is required.'});
        return;
      }

      Toast.show({type: 'success', text1: 'Storage permission granted.'});

      const url = `/getexcelby-state?state=${authstate}`;
      const response = await appAxios.get(url, {
        responseType: 'arraybuffer',
      });

      const contentDisposition = response.headers['content-disposition'];
      let fileName = `products_${authstate}.xlsx`;
      const match = contentDisposition?.match(/filename="?(.+?)"?$/);
      if (match && match[1]) {
        fileName = match[1];
      }

      const base64Data = arrayBufferToBase64(response.data);
      // const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      const path =
        Platform.OS === 'android'
          ? `${RNFS.DownloadDirectoryPath}/${fileName}`
          : `${RNFS.DocumentDirectoryPath}/${fileName}`;

      await RNFS.writeFile(path, base64Data, 'base64');
      Toast.show({
        type: 'success',
        text1: `Excel saved to ${path}`,
        visibilityTime: 5000,
      });

      await Share.open({
        url: 'file://' + path,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
    } catch (err) {
      console.error('Download Excel Error:', err);
      Toast.show({
        type: 'error',
        text1: 'Failed to download Excel',
      });
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{zIndex: 10, backgroundColor: 'white'}}>
        {filter ? (
          <FilterProduct
            sendHandleFilter={handleFilter}
            onFilter={() => setFilter(false)}
          />
        ) : (
          <StickSearchBar
            search={search}
            onSearchChange={handleSearchChange}
            onFilter={() => setFilter(true)}
          />
        )}
      </View>

      <ScrollView
        contentContainerStyle={{paddingBottom: 100}}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled>
        {(authUser?.role === 'ADMIN' || authUser?.role === 'ADMINVIEW') &&
          (isStateLoading && isStateFetching ? (
            <ActivityIndicator size="large" color="#00ff00" />
          ) : isStateError ? (
            <Text>Not found State</Text>
          ) : (
            <View style={{flexDirection: 'row', zIndex: 1000}}>
              <View style={{width: screenWidth * 0.35, zIndex: 5000}}>
                <DropDownPicker
                  open={statusOpen}
                  value={state}
                  items={
                    stateData?.data?.map((state: any) => ({
                      label: state.state,
                      value: state.state,
                    })) || []
                  }
                  setOpen={setStatusOpen}
                  setValue={setStates}
                  placeholder="State"
                  listMode="MODAL"
                  scrollViewProps={{nestedScrollEnabled: true}}
                  dropDownDirection="DEFAULT"
                  style={{
                    borderColor: Colors.primary,
                    borderWidth: 2,
                  }}
                  dropDownContainerStyle={{
                    maxHeight: 200,
                    borderColor: Colors.primary,
                    borderWidth: 1,
                  }}
                />
              </View>

              {authUser?.role === 'ADMIN' && (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    width: screenWidth * 0.65,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingLeft: 10,
                  }}>
                  <TouchableOpacity
                    style={[styles.buttonPrimary, {flex: 1, marginRight: 5}]}
                    onPress={handleDownloadExcel}>
                    <Text style={styles.buttonText}>Download</Text>
                  </TouchableOpacity>
                  {!file ? (
                    <TouchableOpacity
                      style={[styles.buttonPrimary, {flex: 1, marginLeft: 5}]}
                      onPress={handleFilePick}>
                      <Text style={styles.buttonText}>Upload</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[
                        {
                          flex: 1,
                          marginLeft: 5,
                          height: 40,
                          backgroundColor:
                            uploadProgress !== null ? '#f0f0f0' : '#4CAF50',
                          borderRadius: 8,
                          justifyContent: 'center',
                          alignItems: 'center',
                          elevation: 3,
                          shadowColor: '#000',
                          shadowOffset: {width: 0, height: 2},
                          shadowOpacity: 0.2,
                          shadowRadius: 3,
                        },
                      ]}
                      onPress={handleUpload}
                      disabled={uploadProgress !== null}>
                      {!uploadProgress && (
                        <Text
                          style={[
                            styles.buttonText,
                            {color: 'white', fontWeight: '600'},
                          ]}>
                          Submit
                        </Text>
                      )}

                      {uploadProgress !== null && (
                        <View
                          style={{
                            width: '90%',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Progress.Bar
                            progress={uploadProgress / 100}
                            width={null}
                            height={18}
                            color="#4CAF50"
                            unfilledColor="#ddd"
                            borderWidth={0}
                            borderRadius={10}
                          />
                          <Text
                            style={{
                              fontSize: 12,
                              marginTop: 2,
                              color: '#4CAF50',
                              fontWeight: '600',
                            }}>
                            {uploadProgress}% Uploaded
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          ))}

        {isFetching && isLoading ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : isError ? (
          <Text>Not found products</Text>
        ) : (
          <>
            <Products
              key={productsData?.products?.[0]?.id || 'initial'}
              data={productsData?.products || []}
            />
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={styles.paginationButton}
                onPress={handlePreviousPage}
                disabled={currentPage === 1}>
                <Text style={styles.paginationText}>Previous</Text>
              </TouchableOpacity>
              <Text style={styles.paginationText}>
                Page {currentPage} of {productsData?.pagination?.totalPages}
              </Text>
              <TouchableOpacity
                style={styles.paginationButton}
                onPress={handleNextPage}
                disabled={currentPage === productsData?.pagination?.totalPages}>
                <Text style={styles.paginationText}>Next</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  paginationButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
  },
  paginationText: {
    color: 'white',
    fontFamily: Fonts.SemiBold,
  },
});

export default ProductList;
