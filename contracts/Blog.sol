pragma solidity ^0.8.0;
// SPDX-License-Identifier: MIT

contract Blog{
    uint internal blogCount = 0 ;

    function IncrblogCount() internal{
        blogCount++;
    }
    
}
