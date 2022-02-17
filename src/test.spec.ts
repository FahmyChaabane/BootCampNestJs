describe('my test', () => {
  it('returns true', () => {
    expect(true).toEqual(true);
  });
});

class FriendList {
  friends = [];

  addFriend = (element) => {
    this.friends.push(element);
    this.announceFriendship(element);
  };
  announceFriendship = (element) => {
    // console.log(`${element} is now a friend!`);
  };

  removeFriend = (element) => {
    const indx = this.friends.indexOf(element);

    if (indx === -1) {
      throw new Error('Friend Not Found!');
    }

    this.friends.splice(indx, 1);
  };
}

describe('FriendsList', () => {
  let friendList;

  beforeEach(() => {
    friendList = new FriendList();
  });

  it('init friends list', () => {
    expect(friendList.friends.length).toEqual(0);
  });
  it('add a friend to list', () => {
    friendList.addFriend('Fahmi');

    expect(friendList.friends.length).toEqual(1);
  });
  it('announce friendship', () => {
    friendList.announceFriendship = jest.fn();
    expect(friendList.announceFriendship).not.toHaveBeenCalled();
    const input = 'Fahmi';
    friendList.addFriend(input);

    expect(friendList.announceFriendship).toHaveBeenCalledWith(input);
  });

  describe('Remove Friend', () => {
    it('remove a friend from the list', () => {
      const input = 'Sami';
      friendList.addFriend(input);
      expect(friendList.friends[0]).toEqual(input);

      friendList.removeFriend(input);
      expect(friendList.friends.length).toEqual(0);
      expect(friendList.friends[0]).toBeUndefined();
    });
    it('throws an error as friend does not exist', () => {
      expect(() => friendList.removeFriend('tuna')).toThrow();
    });
  });
});
