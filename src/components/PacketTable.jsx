import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

const PacketTable = ({ packets }) => {
  const recentPackets = packets.slice(0, 20);

  const getProtocolColor = (protocol) => {
    if (protocol.includes('HTTP')) return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    if (protocol.includes('SSH')) return 'bg-violet-500/20 text-violet-400 border-violet-500/30';
    if (protocol.includes('DNS')) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    if (protocol.includes('ICMP')) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  const getActionColor = (action) => {
    return action === 'forwarded' 
      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
      : 'bg-rose-500/20 text-rose-400 border-rose-500/30';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  return (
    <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-100">Live Packet Stream</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400 text-center">Time</TableHead>
                <TableHead className="text-slate-400 text-center">ID</TableHead>
                <TableHead className="text-slate-400 text-center">Source</TableHead>
                <TableHead className="text-slate-400 text-center">Destination</TableHead>
                <TableHead className="text-slate-400 text-center">Protocol</TableHead>
                <TableHead className="text-slate-400 text-center">Size</TableHead>
                <TableHead className="text-slate-400 text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPackets.map((packet, index) => (
                <TableRow 
                  key={`${packet.packet_id}-${index}`} 
                  className="border-slate-800 hover:bg-slate-800/50 transition-colors"
                >
                  <TableCell className="text-slate-300 font-mono text-xs">
                    {formatTime(packet.timestamp)}
                  </TableCell>
                  <TableCell className="text-slate-300 font-mono text-sm">
                    #{packet.packet_id}
                  </TableCell>
                  <TableCell className="text-slate-300 font-mono text-xs">
                    {packet.source_ip}:{packet.source_port}
                  </TableCell>
                  <TableCell className="text-slate-300 font-mono text-xs">
                    {packet.dest_ip}:{packet.dest_port}
                  </TableCell>
                  <TableCell>
                    <Badge className={getProtocolColor(packet.protocol)}>
                      {packet.protocol}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300 text-sm">
                    {packet.packet_size}B
                  </TableCell>
                  <TableCell>
                    <Badge className={getActionColor(packet.action)}>
                      {packet.action}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PacketTable;