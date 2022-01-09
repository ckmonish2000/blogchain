pragma solidity ^0.8.0;
// SPDX-License-Identifier: MIT
import "hardhat/console.sol";
import "./Blog.sol";

contract Posts is Blog{
     struct Post{
        uint id;
        string title;
        string content;
        string image;
        address author;
        uint current;
    }

    mapping(uint => Post) public posts;

    function createPost(string memory _title, string memory _content, string memory _img) public {
        Post memory temp = Post(blogCount,_title,_content,_img,msg.sender,0);
        posts[blogCount] = temp;
        IncrblogCount();
    }

    function donate(uint _postid) public payable{
        Post storage _userpost = posts[_postid];
        uint value = msg.value;
        console.log(msg.value);
        _userpost.current += value;
    }

    function get_Posts() view public returns(Post[] memory) {
        Post[] memory data = new Post[](blogCount);

        for(uint i=0; i < blogCount;i++){
            Post memory val = posts[i];
                data[i] = val;
     }
     return data;
    }

    function withdraw_funds(uint _postid) public payable{
        Post storage val = posts[_postid];
        address payable _postowner = payable(val.author);
        require(val.author != msg.sender,"you are not authorized");
        
        _postowner.transfer(val.current);
        val.current = 0;

    }

}


