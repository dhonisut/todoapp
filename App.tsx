import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import ICON from 'react-native-vector-icons/MaterialIcons';

const COLORS = {primary: '#1f145c', white: '#fff'};

function App(): JSX.Element {
  const [toDos, setToDos] = React.useState([
    {id: 1, task: 'Gym', completed: true},
    {id: 2, task: 'Watch anime', completed: false},
  ]);
  const [oldToDos, setOldToDos] = React.useState([
    {id: 1, task: 'Gym', completed: true},
    {id: 2, task: 'Watch anime', completed: false},
  ]);
  const [textInput, setTextInput] = React.useState('');
  const [searchInput, setSearchInput] = React.useState('');
  const [isSearch, setIsSearch] = React.useState(false);
  const [order, setOrder] = React.useState('');

  const ListItem = ({todo}) => {
    return (
      <View style={styles.listItem}>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 15,
              color: COLORS.primary,
              textDecorationLine: todo?.completed ? 'line-through' : 'none',
            }}>
            {todo?.task}
          </Text>
        </View>
        {!todo?.completed && (
          <TouchableOpacity
            style={[styles.actionIcon]}
            onPress={() => setCompleted(todo?.id)}>
            <ICON name="done" size={20} color={COLORS.white} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionIcon, {backgroundColor: 'red'}]}
          onPress={() => setDelete(todo?.id)}>
          <ICON name="delete" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    );
  };

  const addItem = () => {
    if (textInput == '') {
      return Alert.alert('Oops!', "Todo couldn't be empty!");
    }
    const newItem = {
      id: Math.random(),
      task: textInput,
      completed: false,
    };
    toDos.unshift(newItem);
    setToDos([...toDos]);
  };

  const searchItem = () => {
    if (searchInput == '') {
      return Alert.alert('Oops!', "Search couldn't be empty!");
    }
    const oldItem = toDos.slice();
    setOldToDos(oldItem);
    var search = new RegExp(searchInput, 'i');
    let filtered = oldItem.filter(item => search.test(item?.task));

    setToDos(filtered);
    setIsSearch(true);
  };

  const backSearch = () => {
    setSearchInput('');
    setIsSearch(false);
    setToDos(oldToDos);
  };

  const setCompleted = itemId => {
    const itemIndex = toDos.findIndex(todo => {
      return todo?.id === itemId;
    });
    if (itemIndex > -1) {
      toDos[itemIndex].completed = true;
    }
    // if (itemIndex > -1) {
    //   toDos.splice(itemIndex, 1);
    // }
    setToDos([...toDos]);
  };

  const deleteItem = itemId => {
    const itemIndex = toDos.findIndex(todo => {
      return todo?.id === itemId;
    });

    if (itemIndex > -1) {
      toDos.splice(itemIndex, 1);
    }
    setToDos([...toDos]);
  };

  const setDelete = itemId => {
    Alert.alert('Confirm', 'Are you sure want to delete todo?', [
      {
        text: 'Yes',
        onPress: () => deleteItem(itemId),
      },
      {
        text: 'Cancel',
      },
    ]);
  };

  const deleteAll = () => {
    Alert.alert('Confirm', 'Are you sure want to delete all todos?', [
      {
        text: 'Yes',
        onPress: () => setToDos([]),
      },
      {
        text: 'Cancel',
      },
    ]);
  };

  const orderList = filter => {
    if (filter == 'asc') {
      setOrder('asc');
      toDos.sort();
      setToDos(toDos);
    } else {
      setOrder('desc');
      toDos.reverse();
      setToDos(toDos);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <View style={styles.header}>
        <Text style={{fontWeight: 'bold', fontSize: 20, color: COLORS.primary}}>
          TODO APP
        </Text>
        <ICON name="delete" size={25} color="red" onPress={() => deleteAll()} />
      </View>
      <View style={styles.search}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Search todos..."
            value={searchInput}
            onChangeText={text => setSearchInput(text)}
          />
        </View>
        <TouchableOpacity onPress={isSearch ? backSearch : searchItem}>
          <View
            style={
              isSearch ? styles.searchIconContainer : styles.iconContainer
            }>
            <ICON name="search" color={COLORS.white} size={30} />
          </View>
        </TouchableOpacity>
      </View>
      {toDos.length > 0 ? (
        <>
          <View style={{flexDirection: 'row', marginHorizontal: 25}}>
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 15,
                  color: COLORS.primary,
                }}>
                Order
              </Text>
            </View>
            <TouchableOpacity
              style={{marginEnd: 5}}
              onPress={() => orderList('asc')}>
              <Text style={order === 'asc' ? styles.boldText : 'none'}>
                Asc
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => orderList('desc')}>
              <Text style={order === 'desc' ? styles.boldText : 'none'}>
                Desc
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{padding: 20, paddingBottom: 100}}
            data={toDos}
            renderItem={({item}) => <ListItem todo={item} />}
          />
        </>
      ) : (
        <Text style={{fontSize: 24, textAlign: 'center'}}>There's no todo</Text>
      )}

      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Add ToDo"
            value={textInput}
            onChangeText={text => setTextInput(text)}
          />
        </View>
        <TouchableOpacity onPress={addItem}>
          <View style={[styles.iconContainer]}>
            <ICON name="add" color={COLORS.white} size={30} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    color: COLORS.white,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  search: {
    bottom: 0,
    color: COLORS.white,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    elevation: 40,
    flex: 1,
    height: 50,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  inputSearchContainer: {
    backgroundColor: COLORS.white,
    elevation: 40,
    flex: 1,
    height: 50,
    marginVertical: 20,
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    elevation: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIconContainer: {
    height: 50,
    width: 50,
    backgroundColor: 'red',
    borderRadius: 25,
    elevation: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    borderRadius: 3,
  },
  boldText: {
    color: COLORS.primary,
  },
});

export default App;
