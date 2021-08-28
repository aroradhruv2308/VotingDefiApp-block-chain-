pragma solidity >0.4.11;
contract Election{

        // model a candidate
        struct Candidate{
            uint id;
            string name;
            uint voteCount;
        }
        // store account that have voted
        mapping(address => bool) public voters;
        // store candidates
        mapping(uint => Candidate) public candidates;
        //basically when ever you apply public in front of any datastructure or storage variable truffle provide us the method to access them by name()
        // for storing the data of candidates i will be using key value pair which is mapping in solidity
        // fetch candidates
        // store candidate count
        //*********************************************************************************
        //now we will be adding the event that gonna get triggered ever time we cast a vote
         event votedEvent(
             uint indexed _candidateId
         );
        //*********************************************************************************
        uint public candidatesCount;
        constructor() public{
              addCandidate("Candidate 1");
              addCandidate("Candidate 2");

           
        }

        function addCandidate(string memory  _name) private{
            candidatesCount ++;
            candidates[candidatesCount] = Candidate(candidatesCount,_name,0);
        }
        // writing the function to cast vote
        function vote(uint _candidateId) public{
            //require they havent voted before
            require(!voters[msg.sender]);//just like c++
            //require they voting for valid candidate
            require(_candidateId>0 && _candidateId<=candidatesCount);

             
            //record that voter has voted or not
            // now how will we know that which account is voting or is this account has voted earlier
            //so for that we will send the meta data of the person that is currently voting
            // solidity allow us to add or send meta data 
            voters[msg.sender] = true ;//------------------>this is meta data this will give the account
            //increase the vote count for the particular candidate
            candidates[_candidateId].voteCount ++;
            //trigger voted event
            emit votedEvent(_candidateId);
            

        }
 }

