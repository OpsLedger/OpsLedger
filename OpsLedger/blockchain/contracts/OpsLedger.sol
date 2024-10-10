pragma solidity ^0.8.0;

contract CICDLogger {
    struct BuildEvent {
        uint timestamp;
        string buildId;
        string status;
        string developer;
    }
    BuildEvent[] public events;

    event NewBuild(uint indexed timestamp, string buildId, string status, string developer);

    function logBuild(string memory _buildId, string memory _status, string memory _developer) public {
        events.push(BuildEvent(block.timestamp, _buildId, _status, _developer));
        emit NewBuild(block.timestamp, _buildId, _status, _developer);
    }

    function getEvents() public view returns (BuildEvent[] memory) {
        return events;
    }
}

